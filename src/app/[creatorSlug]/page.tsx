import Link from "next/link";
import { notFound } from "next/navigation";
import { Compass, ExternalLink, MapPin, Sparkles, Store } from "lucide-react";
import CreatorCuratedMap from "@/components/mapa/CreatorCuratedMap";
import { listarEstabelecimentosAtivosDoCriador, obterCriadorPorSlug } from "@/services/firebase";

function normalizeUrl(url: string) {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

interface CreatorPageProps {
  params: Promise<{
    creatorSlug: string;
  }>;
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { creatorSlug } = await params;
  const creator = await obterCriadorPorSlug(creatorSlug);

  if (!creator || creator.status === "suspenso") {
    notFound();
  }

  const estabelecimentosVinculados = await listarEstabelecimentosAtivosDoCriador(creator.id);
  const destaques = estabelecimentosVinculados.filter((item) => item.destaque).slice(0, 3);
  const notasCuradoria = estabelecimentosVinculados
    .filter((item) => item.observacaoCuradoria?.trim())
    .slice(0, 4);
  const redesSociais = Object.entries(creator.redesSociais || {}).filter(([, value]) => value?.trim());
  const linksExternos = (creator.linksExternos || []).filter((item) => item.titulo?.trim() && item.url?.trim());
  const favoritos = (creator.favoritos || []).filter((item) => item.trim());

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(26,140,204,0.12),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef6fb_100%)] px-6 py-10 dark:bg-zinc-950 md:px-8">
      <section
        className="mx-auto flex max-w-6xl flex-col gap-6 overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/90"
      >
        {creator.capaUrl && (
          <div
            className="h-40 w-full bg-cover bg-center md:h-56"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.38)), url(${creator.capaUrl})` }}
          />
        )}

        <div className="p-8 md:p-12">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1a8ccc]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#1a8ccc]">
          <Sparkles className="h-3.5 w-3.5" />
          Pagina oficial do criador
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
              {creator.nomePublico}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-zinc-300 md:text-lg">
              {creator.bioCurta || "Curadoria local dentro do ecossistema Vizoor."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-zinc-400">
              {creator.cidade && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-950/60">
                  <MapPin className="h-4 w-4 text-[#1a8ccc]" />
                  {creator.cidade}{creator.estado ? `, ${creator.estado}` : ""}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-950/60">
                <Compass className="h-4 w-4 text-[#1a8ccc]" />
                slug: /{creator.slug}
              </span>
            </div>
          </div>

          {creator.avatarUrl ? (
            <img
              src={creator.avatarUrl}
              alt={creator.nomePublico}
              className="h-28 w-28 rounded-[28px] object-cover ring-4 ring-white dark:ring-zinc-900"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-[#1a8ccc]/10 text-3xl font-black text-[#1a8ccc]">
              {creator.nomePublico.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {creator.bioCompleta && (
          <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/70 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Manifesto da curadoria</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-zinc-300 md:text-base">
              {creator.bioCompleta}
            </p>
          </div>
        )}
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <CreatorCuratedMap items={estabelecimentosVinculados} />

          <div className="rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lugares desta curadoria</h2>
          {estabelecimentosVinculados.length === 0 ? (
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-zinc-300">
              Este criador ainda nao possui estabelecimentos ativos vinculados. A base da pagina dedicada ja esta pronta para receber a curadoria assim que os vinculos forem aprovados.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {estabelecimentosVinculados.map(({ id, destaque, observacaoCuradoria, establishment }) => (
                <article
                  key={id}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{establishment.nome}</h3>
                        {destaque && (
                          <span className="rounded-full bg-[#1a8ccc]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8ccc]">
                            Destaque
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-300">
                        {observacaoCuradoria || establishment.descricao || "Lugar vinculado a esta curadoria."}
                      </p>
                    </div>

                    {establishment.logoUrl ? (
                      <img
                        src={establishment.logoUrl}
                        alt={establishment.nome}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a8ccc]/10 text-[#1a8ccc]">
                        <Store className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-zinc-400">
                    {establishment.endereco && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
                        <MapPin className="h-3.5 w-3.5 text-[#1a8ccc]" />
                        {establishment.endereco}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 capitalize dark:border-zinc-800 dark:bg-zinc-900">
                      <Compass className="h-3.5 w-3.5 text-[#1a8ccc]" />
                      {establishment.categoria.replace(/_/g, " ")}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Resumo da curadoria</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-zinc-400">Lugares ativos</p>
                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{estabelecimentosVinculados.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-zinc-400">Destaques</p>
                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{destaques.length}</p>
              </div>
            </div>

            {creator.categorias && creator.categorias.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Categorias preferidas</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {creator.categorias.slice(0, 6).map((categoria) => (
                    <span
                      key={categoria}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium capitalize text-slate-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300"
                    >
                      {categoria.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(redesSociais.length > 0 || linksExternos.length > 0) && (
              <div className="mt-6">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Links do criador</h3>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {redesSociais.map(([key, value]) => (
                    <a
                      key={key}
                      href={normalizeUrl(value)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold capitalize text-slate-700 transition-colors hover:border-[#1a8ccc] hover:text-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {key}
                    </a>
                  ))}
                  {linksExternos.map((item) => (
                    <a
                      key={`${item.titulo}-${item.url}`}
                      href={normalizeUrl(item.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-[#1a8ccc] hover:text-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {item.titulo}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {creator.roteiroCuradoria && (
            <div className="rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Roteiro do criador</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-zinc-300 md:text-base">
                {creator.roteiroCuradoria}
              </p>
            </div>
          )}

          <div className="rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Selecao em destaque</h2>
            {destaques.length === 0 ? (
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-zinc-300">
                Este criador ainda nao marcou lugares como destaque. A curadoria publica continua visivel logo abaixo no mapa e na lista completa.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {destaques.map(({ id, establishment, observacaoCuradoria }) => {
                  if (!establishment) return null;

                  return (
                    <article
                      key={id}
                      className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"
                    >
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{establishment.nome}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-300">
                        {observacaoCuradoria || establishment.descricao || "Lugar em destaque nesta selecao."}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {favoritos.length > 0 && (
            <div className="rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Favoritos do criador</h2>
              <div className="mt-4 grid gap-3">
                {favoritos.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-4 text-sm font-medium text-slate-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Notas do criador</h2>
            {notasCuradoria.length === 0 ? (
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-zinc-300">
                As observacoes editoriais ainda nao foram preenchidas para os lugares desta curadoria.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {notasCuradoria.map(({ id, establishment, observacaoCuradoria }) => {
                  if (!establishment || !observacaoCuradoria) return null;

                  return (
                    <blockquote
                      key={id}
                      className="rounded-2xl border-l-4 border-[#1a8ccc] bg-slate-50/70 px-4 py-4 text-sm leading-7 text-slate-600 dark:bg-zinc-950/40 dark:text-zinc-300"
                    >
                      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
                        {establishment.nome}
                      </span>
                      {observacaoCuradoria}
                    </blockquote>
                  );
                })}
              </div>
            )}

          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-xl bg-[#1a8ccc] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1572a6]"
          >
            Voltar ao mapa global
          </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
