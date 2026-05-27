"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { db } from "@/services/firebase/config";
import { collection, onSnapshot, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useToast } from "@/components/ui/Toast";

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "nova_reclamacao" | "reclamacao_critica" | "novo_comentario";
  criadoEm: number; // timestamp
  lida: boolean;
  link: string;
  categoriaColor?: string;
  categoriaIcon?: string;
}

interface NotificationContextType {
  notificacoes: Notificacao[];
  naoLidasCount: number;
  triggerShake: boolean;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  removerNotificacao: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications deve ser usado dentro de um NotificationProvider");
  return ctx;
}

const STORAGE_KEY = "navegandosp_admin_notifications";

/**
 * Sintetiza dinamicamente um som de chime (ding) super agradável e premium
 * usando a Web Audio API nativa (sem carregar MP3/WAV externos).
 */
export function playNotificationSound() {
  if (typeof window === "undefined") return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Tonalidade de sino cristalino
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = "sine";
    // Toca um acorde de dois tons sutil e premium (Ré5 para Lá5)
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 (Ré5)
    osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.08); // A5 (Lá5)
    
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.45);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.45);
  } catch (err) {
    console.error("Erro ao reproduzir som sintético de notificação:", err);
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [triggerShake, setTriggerShake] = useState(false);
  
  // Ponto de corte de tempo para ignorar eventos legados do snapshot em tempo real
  const sessionStartTime = useRef(Date.now());
  const isInitialized = useRef(false);

  // 1. Tenta carregar notificações em cache do sessionStorage no início
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          setNotificacoes(JSON.parse(cached));
        }
      } catch (err) {
        console.error("Erro ao ler cache de notificações:", err);
      }
    }
  }, []);

  // 2. Ouve a coleção 'reclamacoes' em tempo real no Firestore
  useEffect(() => {
    const reclamacoesRef = collection(db, "reclamacoes");
    
    // Listener do snapshot
    const unsubscribe = onSnapshot(reclamacoesRef, (snapshot) => {
      // Evita disparar popups no carregamento inicial da coleção inteira
      if (!isInitialized.current) {
        isInitialized.current = true;
        // Opcional: Carrega as últimas 4 reclamações antigas e insere silenciosamente como lidas
        const antigas: Notificacao[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const criadoEmTime = data.criadoEm?.toDate ? data.criadoEm.toDate().getTime() : Date.now();
          
          // Se for uma reclamação existente e antiga
          if (criadoEmTime < sessionStartTime.current) {
            antigas.push({
              id: `old-${doc.id}`,
              titulo: data.titulo || "Novo parceiro no mapa",
              mensagem: `Estabelecimento registrado em ${data.endereco ? data.endereco.split(",")[0] : "São Paulo"}`,
              tipo: "nova_reclamacao",
              criadoEm: criadoEmTime,
              lida: true, // Começa marcada como lida
              link: `/admin/reclamacoes/${doc.id}`,
            });
          }
        });
        
        // Ordena por data decrescente e pega as 5 mais recentes
        antigas.sort((a, b) => b.criadoEm - a.criadoEm);
        const top5Antigas = antigas.slice(0, 5);

        setNotificacoes((prev) => {
          // Mescla com as que já estavam no sessionStorage
          const idsExistentes = new Set(prev.map(n => n.link));
          const novasMescladas = [...prev];
          top5Antigas.forEach((ant) => {
            if (!idsExistentes.has(ant.link)) {
              novasMescladas.push(ant);
            }
          });
          novasMescladas.sort((a, b) => b.criadoEm - a.criadoEm);
          return novasMescladas;
        });
        return;
      }

      // Processa mudanças em tempo real (docAdded)
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const docData = change.doc.data();
          const criadoEmTime = docData.criadoEm?.toDate ? docData.criadoEm.toDate().getTime() : Date.now();
          
          // Confirmação dupla de que a ocorrência de fato é nova (criada após abrir o painel)
          if (criadoEmTime >= sessionStartTime.current - 5000) {
            const idReclamacao = change.doc.id;
            const titulo = docData.titulo || "Novo relato registrado";
            const enderecoCurto = docData.endereco ? docData.endereco.split(",")[0] : "São Paulo";

            const novaNotif: Notificacao = {
              id: `notif-${Date.now()}-${idReclamacao}`,
              titulo: "Nova Parceria Recebida",
              mensagem: `"${titulo}" em ${enderecoCurto}`,
              tipo: "nova_reclamacao",
              criadoEm: criadoEmTime,
              lida: false,
              link: `/admin/reclamacoes/${idReclamacao}`,
            };

            // Adiciona ao feed
            setNotificacoes((prev) => {
              const atualizadas = [novaNotif, ...prev].slice(0, 20); // limita em 20 notificações no total
              if (typeof window !== "undefined") {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));
              }
              return atualizadas;
            });

            // Efeitos Premium WOW!
            playNotificationSound();
            setTriggerShake(true);
            setTimeout(() => setTriggerShake(false), 900); // Para a animação após vibrar

            // Toast Deslizante Lateral
            showToast(
              "info",
              "Nova Parceria Recebida 📍",
              `"${titulo}" foi registrado em ${enderecoCurto}. Clique no sino para gerenciar.`
            );
          }
        }
      });
    });

    return () => unsubscribe();
  }, [showToast]);

  // Conta quantas notificações não estão lidas
  const naoLidasCount = notificacoes.filter((n) => !n.lida).length;

  // Marca uma notificação como lida
  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes((prev) => {
      const atualizadas = prev.map((n) => (n.id === id ? { ...n, lida: true } : n));
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));
      }
      return atualizadas;
    });
  }, []);

  // Marca todas como lidas
  const marcarTodasComoLidas = useCallback(() => {
    setNotificacoes((prev) => {
      const atualizadas = prev.map((n) => ({ ...n, lida: true }));
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));
      }
      return atualizadas;
    });
    showToast("success", "Notificações", "Todas as notificações foram marcadas como lidas.");
  }, [showToast]);

  // Remove uma notificação do feed
  const removerNotificacao = useCallback((id: string) => {
    setNotificacoes((prev) => {
      const atualizadas = prev.filter((n) => n.id !== id);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));
      }
      return atualizadas;
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notificacoes,
        naoLidasCount,
        triggerShake,
        marcarComoLida,
        marcarTodasComoLidas,
        removerNotificacao,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
