"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "../../components/Toast/toast"; 
import Image from "next/image";
import styles from "./perfil.module.css";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("access") : null;
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" };
}

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

// ─── Mapeamentos ──────────────────────────────────────────────────────────────
const STATUS_LABEL = {
  pendente: "Pendente",
  confirmada: "Confirmada",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

const STATUS_BADGE = {
  pendente: "badge-processando",
  confirmada: "badge-em-rota",
  concluida: "badge-entregue",
  cancelada: "badge-cancelada",
};

function formatarData(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatarDataVisita(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
}

function iniciaisNome(nome) {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function doisPrimeirosNomes(nome) {
  if (!nome) return "";
  const partes = nome.trim().split(" ").filter(Boolean);
  return partes.slice(0, 2).join(" ");
}

function useContentType(url) {
  const [tipo, setTipo] = useState(null);
  useEffect(() => {
    if (!url) return;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("pdf")) setTipo("pdf");
        else if (ct.startsWith("image/")) setTipo("imagem");
        else setTipo("outro");
      })
      .catch(() => setTipo("outro"));
  }, [url]);
  return tipo;
}

// ─── Ícones ───────────────────────────────────────────────────────────────────
function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.8s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Tela: Não logado ─────────────────────────────────────────────────────────
function TelaNaoLogado() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0e8df",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        border: "0.5px solid #ddd0c4",
        padding: "3rem 2.5rem",
        maxWidth: 400,
        width: "calc(100% - 2rem)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#f0e4d7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b4226",
          marginBottom: "1.25rem",
        }}>
          <IconLock />
        </div>
        <h2 style={{
          margin: "0 0 0.5rem",
          fontSize: 22,
          fontWeight: 600,
          color: "#3d2010",
          fontFamily: '"Jomolhari", serif',
        }}>
          Acesso restrito
        </h2>
        <p style={{
          margin: "0 0 1.75rem",
          fontSize: 15,
          color: "#9a7a5e",
          fontFamily: "Poppins, sans-serif",
          lineHeight: 1.6,
        }}>
          Você precisa estar logado para acessar essa página.
        </p>
        <a
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#6b4226",
            color: "#f5ede4",
            borderRadius: 8,
            padding: "10px 28px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "Poppins, sans-serif",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#3d2010"}
          onMouseLeave={e => e.currentTarget.style.background = "#6b4226"}
        >
          Fazer login aqui
        </a>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ tela, onNavegar, usuario, onLogout }) {
  const iniciais = iniciaisNome(usuario?.full_name || usuario?.username);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarUser}>
        <div className={styles.avatar}>{iniciais}</div>
        <div>
          <p className={styles.sidebarNome}>
            {doisPrimeirosNomes(usuario?.full_name) || usuario?.username || "..."}
          </p>
          <p className={styles.sidebarRole}>Cliente</p>
        </div>
      </div>

      <button className={`${styles.sidebarItem} ${tela === "pedidos" ? styles.sidebarItemActive : ""}`} onClick={() => onNavegar("pedidos")}>
        <span className={styles.sidebarIcon}><Image src="/perfil/sacolinha.svg" width={20} height={20} alt="caixa"/></span>
        <span className={styles.sidebarLabel}>Meus pedidos</span>
        <span className={styles.sidebarChevron}><IconChevronRight /></span>
      </button>

      <button className={`${styles.sidebarItem} ${tela === "editar" ? styles.sidebarItemActive : ""}`} onClick={() => onNavegar("editar")}>
        <span className={styles.sidebarIcon}><Image src="/perfil/edit.svg" width={20} height={20} alt="editar"/></span>
        <span className={styles.sidebarLabel}>Editar perfil</span>
        <span className={styles.sidebarChevron}><IconChevronRight /></span>
      </button>

      <div className={styles.sidebarFooter}>
        <button className={`${styles.sidebarItem} ${styles.sidebarItemLogout}`} onClick={onLogout}>
          <span className={styles.sidebarIcon}><Image src="/perfil/logout.svg" width={20} height={20} alt="logout"/></span>
          <span className={styles.sidebarLabel}>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Tela Início ──────────────────────────────────────────────────────────────
function TelaInicio({ onNavegar, usuario, reservas, carregandoReservas }) {
  const ultimo = reservas?.[0];
  const primeiroItem = ultimo?.itens?.[0];

  function detalhesItem(item) {
    if (!item) return null;
    const partes = [];
    if (item.cor) partes.push(`Cor: ${item.cor}`);
    if (item.lentes?.length) partes.push(`Lentes: ${item.lentes.join(", ")}`);
    return partes.join(" · ") || null;
  }

  return (
    <main className={styles.conteudo}>
      <div className={styles.boasVindas}>
        <p className={styles.boasVindasLabel}>
          Bem-vindo{usuario?.full_name?.split(" ")[0]?.slice(-1) === "a" ? "a" : ""} de volta
        </p>
        <h2 className={styles.boasVindasNome}>{usuario?.full_name || usuario?.username || "..."}</h2>
        <p className={styles.boasVindasEmail}>{usuario?.email || ""}</p>
      </div>

      <div className={styles.ultimoPedidoSection}>
        <p className={styles.sectionLabel}>Último pedido</p>

        {carregandoReservas ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--marrom-claro)", fontSize: 14 }}>
            <IconSpinner /> Carregando...
          </div>
        ) : !ultimo ? (
          <p style={{ fontSize: 14, color: "var(--marrom-claro)", fontFamily: "Poppins, sans-serif" }}>
            Nenhum pedido encontrado.
          </p>
        ) : (
          <>
            <div className={styles.pedidoRow}>
              <div className={styles.pedidoIcone}><Image src="/perfil/oculos.svg" width={25} height={25} alt="oculos"/></div>
              <div className={styles.pedidoInfo}>
                <p className={styles.pedidoNome}>
                  {primeiroItem?.nome || "Reserva"}
                  {ultimo.itens?.length > 1 && (
                    <span style={{ fontWeight: 400, fontSize: 14, color: "var(--marrom-claro)" }}>
                      {" "}+{ultimo.itens.length - 1}
                    </span>
                  )}
                </p>
                {detalhesItem(primeiroItem) && (
                  <p className={styles.pedidoMeta} style={{ color: "var(--marrom-claro)" }}>
                    {detalhesItem(primeiroItem)}
                  </p>
                )}
                <p className={styles.pedidoMeta}>
                  Reserva #{ultimo.id} · {formatarData(ultimo.criado_em)}
                </p>
              </div>
              <span className={`${styles.badge} ${styles[STATUS_BADGE[ultimo.status] || "badge-processando"]}`}>
                {STATUS_LABEL[ultimo.status] || ultimo.status}
              </span>
            </div>
            <button className={styles.verTodos} onClick={() => onNavegar("pedidos")}>
              Ver todos os pedidos <IconArrowRight />
            </button>
          </>
        )}
      </div>
    </main>
  );
}

// ─── Modal Detalhes + Receita ─────────────────────────────────────────────────
function ModalDetalhes({ reserva, onFechar }) {
  const receitaUrl = reserva?.receita_url;
  const tipo = useContentType(receitaUrl);

  return (
    <div className={styles.modalOverlay} onClick={onFechar} style={{
      overflowY: "auto",
      alignItems: "flex-start",
      padding: "2rem 1rem",
      zIndex: 9999,
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      background: "rgba(40, 20, 10, 0.55)",
    }}>
      <div
        className={styles.modalBox}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: receitaUrl ? 620 : 360,
          maxWidth: "calc(100vw - 2rem)",
          margin: "auto",
          position: "relative",
          animation: "modalEntrada 0.18s ease",
        }}
      >
        <style>{`
          @keyframes modalEntrada {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div className={styles.modalHeader}>
          <p className={styles.modalTitulo}>Reserva #{reserva.id}</p>
          <button className={styles.modalFechar} onClick={onFechar}><IconX /></button>
        </div>

        <div className={styles.receitaCard} style={{ marginBottom: "1rem" }}>
          <p className={styles.receitaOlho}>Itens do pedido</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reserva.itens?.map((item, i) => {
              const lentesStr = Array.isArray(item.lentes) && item.lentes.length
                ? item.lentes.join(", ")
                : null;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                    {item.nome}
                    {item.quantidade > 1 && (
                      <span style={{ fontWeight: 400, color: "var(--marrom-claro)" }}> x{item.quantidade}</span>
                    )}
                  </span>
                  <span style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>
                    {[
                      item.cor && `Cor: ${item.cor}`,
                      lentesStr && `Lentes: ${lentesStr}`,
                    ].filter(Boolean).join(" · ")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.receitaDivisor} />

          <p className={styles.receitaOlho}>Mais informações</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reserva.data_visita && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className={styles.receitaLabel}>Data da visita</span>
                <span className={styles.receitaValor} style={{ fontSize: 13 }}>
                  {formatarDataVisita(reserva.data_visita)}
                </span>
              </div>
            )}
            {reserva.horario_visita && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className={styles.receitaLabel}>Horário</span>
                <span className={styles.receitaValor} style={{ fontSize: 13 }}>
                  {reserva.horario_visita.slice(0, 5)}
                </span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={styles.receitaLabel}>Status</span>
              <span className={`${styles.badge} ${styles[STATUS_BADGE[reserva.status] || "badge-processando"]}`}
                style={{ padding: "2px 10px", fontSize: 12 }}>
                {STATUS_LABEL[reserva.status] || reserva.status}
              </span>
            </div>
            {reserva.observacoes && (
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                <span className={styles.receitaLabel}>Observações</span>
                <span style={{ fontSize: 13, color: "#444", fontFamily: "sans-serif" }}>
                  {reserva.observacoes}
                </span>
              </div>
            )}
            {reserva.observacoes_admin && (
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                <span className={styles.receitaLabel}>Retorno da ótica</span>
                <span style={{ fontSize: 13, color: "#3d2010", fontFamily: "sans-serif", fontStyle: "italic" }}>
                  {reserva.observacoes_admin}
                </span>
              </div>
            )}
          </div>
        </div>

        {receitaUrl ? (
          <div>
            <p className={styles.receitaOlho} style={{ marginBottom: 8 }}>Receita médica</p>

            {tipo === null && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--marrom-claro)", fontSize: 13, marginBottom: 8, fontFamily: "Poppins, sans-serif" }}>
                <IconSpinner /> Carregando visualização...
              </div>
            )}

            {tipo === "imagem" && (
              <img
                src={receitaUrl}
                alt="Receita médica"
                style={{ width: "100%", borderRadius: 8, border: "0.5px solid var(--borda)", display: "block", marginBottom: 8 }}
              />
            )}

            {tipo === "pdf" && (
              <div style={{
                marginBottom: 8, padding: "14px 16px", background: "#faf6f2",
                border: "0.5px solid var(--borda)", borderRadius: 8, fontSize: 13,
                color: "var(--marrom-claro)", fontFamily: "Poppins, sans-serif",
              }}>
                Visualização de PDF não disponível no navegador. Use o botão abaixo para baixar.
              </div>
            )}

            {tipo === "outro" && (
              <p style={{ fontSize: 13, color: "var(--marrom-claro)", fontFamily: "sans-serif", marginBottom: 8 }}>
                Tipo de arquivo não suportado para pré-visualização.
              </p>
            )}

            <a
              href={receitaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnReceita}
              style={{ display: "inline-flex", gap: 6, padding: "7px 14px", fontSize: 12 }}
            >
              <Image src="/perfil/download.svg" width={15} height={15} alt="download"/> Baixar receita
            </a>
          </div>
        ) : (
          <p className={styles.receitaMeta}>Nenhuma receita anexada a esta reserva.</p>
        )}
      </div>
    </div>
  );
}

// ─── Tela Pedidos ─────────────────────────────────────────────────────────────
function TelaPedidos({ onNavegar, reservas, carregandoReservas, erroReservas }) {
  const [reservaAberta, setReservaAberta] = useState(null);

  function detalhesItem(item) {
    if (!item) return null;
    const partes = [];
    if (item.cor) partes.push(`Cor: ${item.cor}`);
    if (item.lentes?.length) partes.push(`Lentes: ${item.lentes.join(", ")}`);
    return partes.join(" · ") || null;
  }

  return (
    <main className={styles.conteudo}>
      <div className={styles.telaHeader}>
        <button className={styles.voltar} onClick={() => onNavegar("inicio")}>
          <IconArrowLeft /> Voltar
        </button>
        <span className={styles.telaHeaderSep}>/</span>
        <span className={styles.telaHeaderTitulo}>Meus pedidos</span>
      </div>

      {carregandoReservas ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--marrom-claro)", fontSize: 14, fontFamily: "Poppins, sans-serif" }}>
          <IconSpinner /> Carregando reservas...
        </div>
      ) : erroReservas ? (
        // Erro de carregamento exibido inline pois é estado persistente da tela, não uma ação pontual
        <p style={{ color: "#a32d2d", fontSize: 14, fontFamily: "Poppins, sans-serif" }}>{erroReservas}</p>
      ) : reservas.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--marrom-claro)", fontFamily: "Poppins, sans-serif" }}>
          Você ainda não fez nenhuma reserva.
        </p>
      ) : (
        <div className={styles.listaPedidos}>
          {reservas.map((r) => {
            const item = r.itens?.[0];
            const dataVisita = formatarDataVisita(r.data_visita);
            return (
              <div key={r.id} className={styles.pedidoRow}>
                <div className={styles.pedidoIcone}><Image src="/perfil/oculos.svg" width={25} height={25} alt="oculos"/></div>
                <div className={styles.pedidoInfo}>
                  <p className={styles.pedidoNome}>
                    {item?.nome || "Reserva"}
                    {r.itens?.length > 1 && (
                      <span style={{ fontWeight: 400, fontSize: 14, color: "var(--marrom-claro)" }}>
                        {" "}+{r.itens.length - 1} item{r.itens.length - 1 > 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                  {detalhesItem(item) && (
                    <p className={styles.pedidoMeta} style={{ color: "var(--marrom-medio)" }}>
                      {detalhesItem(item)}
                    </p>
                  )}
                  <p className={styles.pedidoMeta}>
                    Reserva #{r.id} · {formatarData(r.criado_em)}
                    {dataVisita && ` · Visita: ${dataVisita}`}
                  </p>
                </div>
                <div className={styles.pedidoAcoes}>
                  <button className={styles.btnReceita} onClick={() => setReservaAberta(r)}>
                    <Image src="/perfil/vermais.svg" width={15} height={15} alt="filezinho"/> Mais informações
                  </button>
                  <span className={`${styles.badge} ${styles[STATUS_BADGE[r.status] || "badge-processando"]}`}>
                    {STATUS_LABEL[r.status] || r.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reservaAberta && (
        <ModalDetalhes reserva={reservaAberta} onFechar={() => setReservaAberta(null)} />
      )}
    </main>
  );
}

// ─── Tela Editar ──────────────────────────────────────────────────────────────
function TelaEditar({ onNavegar, usuario, onUsuarioAtualizado }) {
  const mostrarToast = useToast();

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [nome, setNome] = useState(usuario?.full_name || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const iniciais = iniciaisNome(nome || usuario?.username);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.full_name || "");
      setEmail(usuario.email || "");
    }
  }, [usuario]);

  async function handleSalvarPerfil() {
    if (!nome.trim()) {
      mostrarToast("O nome não pode ser vazio.", "aviso");
      return;
    }
    if (!email.trim()) {
      mostrarToast("O e-mail não pode ser vazio.", "aviso");
      return;
    }

    setLoadingPerfil(true);
    try {
      const res = await fetch(`${API_BASE}/me/`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ full_name: nome, email }),
      });
      const data = await res.json();
      if (res.ok) {
        const atualizado = { ...usuario, ...data };
        localStorage.setItem("user", JSON.stringify(atualizado));
        onUsuarioAtualizado(atualizado);
        window.dispatchEvent(new Event("storage"));
        mostrarToast("Perfil atualizado com sucesso!", "sucesso");
      } else {
        mostrarToast(data?.erro || "Erro ao atualizar perfil.", "erro");
      }
    } catch {
      mostrarToast("Erro de conexão. Tente novamente.", "erro");
    } finally {
      setLoadingPerfil(false);
    }
  }

  async function handleSalvarSenha() {
    if (!senhaAtual) {
      mostrarToast("Informe a senha atual.", "aviso");
      return;
    }
    if (!novaSenha) {
      mostrarToast("Informe a nova senha.", "aviso");
      return;
    }

    setLoadingSenha(true);
    try {
      const res = await fetch(`${API_BASE}/change-password/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }),
      });
      const data = await res.json();
      if (res.ok) {
        setSenhaAtual("");
        setNovaSenha("");
        mostrarToast("Senha alterada com sucesso!", "sucesso");
      } else {
        const msg = Array.isArray(data?.erro)
          ? data.erro.join(" ")
          : data?.erro || data?.detail || "Erro ao alterar senha.";
        mostrarToast(msg, "erro");
      }
    } catch {
      mostrarToast("Erro de conexão. Tente novamente.", "erro");
    } finally {
      setLoadingSenha(false);
    }
  }

  return (
    <main className={styles.conteudo}>
      <div className={styles.telaHeader}>
        <button className={styles.voltar} onClick={() => onNavegar("inicio")}>
          <IconArrowLeft /> Voltar
        </button>
        <span className={styles.telaHeaderSep}>/</span>
        <span className={styles.telaHeaderTitulo}>Editar perfil</span>
      </div>

      <div className={styles.editarForm}>

        {/* ── Seção: dados do perfil ── */}
        <div className={styles.editarAvatarRow}>
          <div className={styles.avatarGrande}>{iniciais}</div>
          <div className={styles.editarNomeGroup}>
            <div className={styles.formCampo}>
              <label className={styles.formLabel}>Nome completo</label>
              <input
                className={styles.formInput}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
          </div>
        </div>

        <div className={styles.formCampo}>
          <label className={styles.formLabel}>E-mail</label>
          <input
            className={styles.formInput}
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@example.com"
          />
        </div>

        <div className={styles.formCampo}>
          <label className={styles.formLabel}>Username</label>
          <input
            className={styles.formInput}
            value={usuario?.username || ""}
            disabled
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          />
        </div>

        <div className={styles.formAcoes} style={{ marginBottom: "2rem" }}>
          <button className={styles.btnSalvar} onClick={handleSalvarPerfil} disabled={loadingPerfil}>
            {loadingPerfil ? <><IconSpinner /> Salvando...</> : "Salvar perfil"}
          </button>
        </div>

        {/* ── Seção: alterar senha ── */}
        <div className={styles.senhaSeparador}>
          <p className={styles.senhaSubtitulo}>Alterar senha</p>

          <div className={styles.formCampo}>
            <label className={styles.formLabel}>Senha atual</label>
            <div className={styles.inputSenhaWrapper}>
              <input
                className={styles.formInput}
                type={mostrarSenhaAtual ? "text" : "password"}
                placeholder="••••••••"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
              <button type="button" className={styles.btnOlho} onClick={() => setMostrarSenhaAtual(v => !v)}>
                {mostrarSenhaAtual ? <Image src="/perfil/fechado.svg" width={18} height={18} alt="olho fechado"/> : <Image src="/perfil/aberto.svg" width={18} height={18} alt="olho aberto"/>}
              </button>
            </div>
          </div>

          <div className={styles.formCampo}>
            <label className={styles.formLabel}>Nova senha</label>
            <div className={styles.inputSenhaWrapper}>
              <input
                className={styles.formInput}
                type={mostrarNovaSenha ? "text" : "password"}
                placeholder="••••••••"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <button type="button" className={styles.btnOlho} onClick={() => setMostrarNovaSenha(v => !v)}>
                {mostrarNovaSenha ? <Image src="/perfil/fechado.svg" width={18} height={18} alt="olho fechado"/> : <Image src="/perfil/aberto.svg" width={18} height={18} alt="olho aberto"/>}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formAcoes}>
          <button className={styles.btnSalvar} onClick={handleSalvarSenha} disabled={loadingSenha}>
            {loadingSenha ? <><IconSpinner /> Salvando...</> : "Salvar senha"}
          </button>
          <button className={styles.btnCancelar} onClick={() => onNavegar("inicio")}>Cancelar</button>
        </div>

      </div>
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function PerfilPage() {
  const mostrarToast = useToast();

  const [tela, setTela] = useState("inicio");
  const [usuario, setUsuario] = useState(null);
  const [autenticado, setAutenticado] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [carregandoReservas, setCarregandoReservas] = useState(true);
  const [erroReservas, setErroReservas] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { setAutenticado(false); return; }

    const payload = decodeToken(token);
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      setAutenticado(false);
      return;
    }

    setAutenticado(true);

    fetch(`${API_BASE}/me/`, { headers: authHeaders() })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((perfil) => {
        setUsuario(perfil);
        localStorage.setItem("user", JSON.stringify(perfil));
      })
      .catch(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
          try { setUsuario(JSON.parse(stored)); } catch { /* ignora */ }
        } else if (payload) {
          setUsuario({
            username: payload.username || payload.sub,
            email: payload.email,
            full_name: payload.full_name || payload.name,
          });
        }
      });
  }, []);

  const buscarReservas = useCallback(async () => {
    setCarregandoReservas(true);
    setErroReservas(null);
    try {
      const res = await fetch(`${API_BASE}/reservas/minhas/`, { headers: authHeaders() });
      if (res.status === 401) {
        mostrarToast("Sessão expirada. Faça login novamente.", "erro");
        setAutenticado(false);
        return;
      }
      if (!res.ok) {
        mostrarToast("Erro ao buscar reservas.", "erro");
        setErroReservas("Erro ao buscar reservas.");
        return;
      }
      const data = await res.json();
      setReservas(Array.isArray(data) ? data : (data.results ?? []));
    } catch {
      mostrarToast("Erro de conexão. Verifique sua internet.", "erro");
      setErroReservas("Erro de conexão. Verifique sua internet.");
    } finally {
      setCarregandoReservas(false);
    }
  }, [mostrarToast]);

  useEffect(() => {
    if (autenticado) buscarReservas();
  }, [autenticado, buscarReservas]);

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("full_name");
    localStorage.removeItem("username");   
    window.location.href = "/";
  }

  if (autenticado === null) return null;
  if (autenticado === false) return <TelaNaoLogado />;

  return (
    <div className={styles.pagina}>
      <div className={styles.layout}>
        <Sidebar tela={tela} onNavegar={setTela} usuario={usuario} onLogout={handleLogout} />
        {tela === "inicio" && (
          <TelaInicio onNavegar={setTela} usuario={usuario} reservas={reservas} carregandoReservas={carregandoReservas} />
        )}
        {tela === "pedidos" && (
          <TelaPedidos onNavegar={setTela} reservas={reservas} carregandoReservas={carregandoReservas} erroReservas={erroReservas} />
        )}
        {tela === "editar" && (
          <TelaEditar onNavegar={setTela} usuario={usuario} onUsuarioAtualizado={setUsuario} />
        )}
      </div>
    </div>
  );
}