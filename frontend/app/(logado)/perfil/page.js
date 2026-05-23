"use client";

import { useState } from "react";
import styles from "./perfil.module.css";

const pedidos = [
  {
    id: "0042",
    nome: "Armação Ray-Ban RB5154",
    data: "10 mai 2026",
    status: "entregue",
    icone: "eyeglass",
    receita: {
      od: { esferico: "-2,25", cilindrico: "-0,75", eixo: "180°" },
      oe: { esferico: "-2,00", cilindrico: "-0,50", eixo: "175°" },
      medico: "Dr. Carlos Rocha",
      data: "08 mai 2026",
    },
  },
  {
    id: "0039",
    nome: "Óculos de Sol Oakley",
    data: "02 mai 2026",
    status: "em-rota",
    icone: "sun",
    receita: null,
  },
  {
    id: "0031",
    nome: "Lentes de Contato Acuvue",
    data: "14 abr 2026",
    status: "entregue",
    icone: "eyeglass",
    receita: {
      od: { esferico: "-1,75", cilindrico: "-0,25", eixo: "90°" },
      oe: { esferico: "-2,00", cilindrico: "-0,50", eixo: "85°" },
      medico: "Dra. Fernanda Lima",
      data: "12 abr 2026",
    },
  },
];

const statusLabel = {
  entregue: "Entregue",
  "em-rota": "Em rota",
  processando: "Processando",
};

function IconEyeglass() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="14" r="3" />
      <circle cx="17" cy="14" r="3" />
      <path d="M4 14a8 8 0 0 1 16 0" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
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

function IconLogout() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Sidebar({ tela, onNavegar }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarUser}>
        <div className={styles.avatar}>AM</div>
        <div>
          <p className={styles.sidebarNome}>Ana Menezes</p>
          <p className={styles.sidebarRole}>Cliente</p>
        </div>
      </div>

      <button
        className={`${styles.sidebarItem} ${tela === "pedidos" ? styles.sidebarItemActive : ""}`}
        onClick={() => onNavegar("pedidos")}
      >
        <span className={styles.sidebarIcon}><IconBag /></span>
        <span className={styles.sidebarLabel}>Meus pedidos</span>
        <span className={styles.sidebarChevron}><IconChevronRight /></span>
      </button>

      <button
        className={`${styles.sidebarItem} ${tela === "editar" ? styles.sidebarItemActive : ""}`}
        onClick={() => onNavegar("editar")}
      >
        <span className={styles.sidebarIcon}><IconEdit /></span>
        <span className={styles.sidebarLabel}>Editar perfil</span>
        <span className={styles.sidebarChevron}><IconChevronRight /></span>
      </button>

      <div className={styles.sidebarFooter}>
        <button className={`${styles.sidebarItem} ${styles.sidebarItemLogout}`}>
          <span className={styles.sidebarIcon}><IconLogout /></span>
          <span className={styles.sidebarLabel}>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}

function TelaInicio({ onNavegar }) {
  const ultimo = pedidos[1];
  return (
    <main className={styles.conteudo}>
      <div className={styles.boasVindas}>
        <p className={styles.boasVindasLabel}>Bem-vinda de volta</p>
        <h2 className={styles.boasVindasNome}>Ana Menezes</h2>
        <p className={styles.boasVindasEmail}>ana.menezes@email.com</p>
      </div>

      <div className={styles.ultimoPedidoSection}>
        <p className={styles.sectionLabel}>Último pedido</p>
        <div className={styles.pedidoRow}>
          <div className={styles.pedidoIcone}>
            <IconSun />
          </div>
          <div className={styles.pedidoInfo}>
            <p className={styles.pedidoNome}>{ultimo.nome}</p>
            <p className={styles.pedidoMeta}>Pedido #{ultimo.id} · {ultimo.data}</p>
          </div>
          <span className={`${styles.badge} ${styles[`badge-${ultimo.status}`]}`}>
            {statusLabel[ultimo.status]}
          </span>
        </div>
        <button className={styles.verTodos} onClick={() => onNavegar("pedidos")}>
          Ver todos os pedidos <IconArrowRight />
        </button>
      </div>
    </main>
  );
}

function TelaPedidos({ onNavegar }) {
  const [receitaAberta, setReceitaAberta] = useState(null);

  return (
    <main className={styles.conteudo}>
      <div className={styles.telaHeader}>
        <button className={styles.voltar} onClick={() => onNavegar("inicio")}>
          <IconArrowLeft /> Voltar
        </button>
        <span className={styles.telaHeaderSep}>/</span>
        <span className={styles.telaHeaderTitulo}>Meus pedidos</span>
      </div>

      <div className={styles.listaPedidos}>
        {pedidos.map((p) => (
          <div key={p.id} className={styles.pedidoRow}>
            <div className={styles.pedidoIcone}>
              {p.icone === "sun" ? <IconSun /> : <IconEyeglass />}
            </div>
            <div className={styles.pedidoInfo}>
              <p className={styles.pedidoNome}>{p.nome}</p>
              <p className={styles.pedidoMeta}>Pedido #{p.id} · {p.data}</p>
            </div>
            <div className={styles.pedidoAcoes}>
              {p.receita && (
                <button
                  className={styles.btnReceita}
                  onClick={() => setReceitaAberta(p)}
                >
                  <IconFile /> Ver receita
                </button>
              )}
              <span className={`${styles.badge} ${styles[`badge-${p.status}`]}`}>
                {statusLabel[p.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {receitaAberta && (
        <div className={styles.modalOverlay} onClick={() => setReceitaAberta(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitulo}>Receita enviada</p>
              <button className={styles.modalFechar} onClick={() => setReceitaAberta(null)}>
                <IconX />
              </button>
            </div>
            <div className={styles.receitaCard}>
              <p className={styles.receitaOlho}>Olho direito (OD)</p>
              <div className={styles.receitaGrade}>
                <div>
                  <p className={styles.receitaLabel}>Esférico</p>
                  <p className={styles.receitaValor}>{receitaAberta.receita.od.esferico}</p>
                </div>
                <div>
                  <p className={styles.receitaLabel}>Cilíndrico</p>
                  <p className={styles.receitaValor}>{receitaAberta.receita.od.cilindrico}</p>
                </div>
                <div>
                  <p className={styles.receitaLabel}>Eixo</p>
                  <p className={styles.receitaValor}>{receitaAberta.receita.od.eixo}</p>
                </div>
              </div>
              <div className={styles.receitaDivisor} />
              <p className={styles.receitaOlho}>Olho esquerdo (OE)</p>
              <div className={styles.receitaGrade}>
                <div>
                  <p className={styles.receitaLabel}>Esférico</p>
                  <p className={styles.receitaValor}>{receitaAberta.receita.oe.esferico}</p>
                </div>
                <div>
                  <p className={styles.receitaLabel}>Cilíndrico</p>
                  <p className={styles.receitaValor}>{receitaAberta.receita.oe.cilindrico}</p>
                </div>
                <div>
                  <p className={styles.receitaLabel}>Eixo</p>
                  <p className={styles.receitaValor}>{receitaAberta.receita.oe.eixo}</p>
                </div>
              </div>
            </div>
            <p className={styles.receitaMeta}>
              Enviada em {receitaAberta.receita.data} · {receitaAberta.receita.medico}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function IconEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function TelaEditar({ onNavegar }) {
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
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
        <div className={styles.editarAvatarRow}>
          <div className={styles.avatarGrande}>AM</div>
          <div className={styles.editarNomeGroup}>
            <div className={styles.formCampo}>
              <label className={styles.formLabel}>Nome completo</label>
              <input className={styles.formInput} defaultValue="Ana Menezes" />
            </div>
          </div>
        </div>

        <div className={styles.formCampo}>
          <label className={styles.formLabel}>E-mail</label>
          <input className={styles.formInput} defaultValue="ana.menezes@email.com" type="email" />
        </div>

        <div className={styles.formCampo}>
          <label className={styles.formLabel}>Telefone</label>
          <input className={styles.formInput} defaultValue="(81) 99999-0000" type="tel" />
        </div>

        <div className={styles.senhaSeparador}>
          <p className={styles.senhaSubtitulo}>Alterar senha</p>
          <div className={styles.formCampo}>
            <label className={styles.formLabel}>Senha atual</label>
            <div className={styles.inputSenhaWrapper}>
              <input
                className={styles.formInput}
                type={mostrarSenhaAtual ? "text" : "password"}
                placeholder="••••••••"
              />
              <button
                type="button"
                className={styles.btnOlho}
                onClick={() => setMostrarSenhaAtual(v => !v)}
              >
                {mostrarSenhaAtual ? <IconEyeOff /> : <IconEye />}
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
              />
              <button
                type="button"
                className={styles.btnOlho}
                onClick={() => setMostrarNovaSenha(v => !v)}
              >
                {mostrarNovaSenha ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formAcoes}>
          <button className={styles.btnSalvar}>Salvar alterações</button>
          <button className={styles.btnCancelar} onClick={() => onNavegar("inicio")}>
            Cancelar
          </button>
        </div>
      </div>
    </main>
  );
}

export default function PerfilPage() {
  const [tela, setTela] = useState("inicio");

  return (
    <div className={styles.pagina}>
      <div className={styles.layout}>
        <Sidebar tela={tela} onNavegar={setTela} />
        {tela === "inicio" && <TelaInicio onNavegar={setTela} />}
        {tela === "pedidos" && <TelaPedidos onNavegar={setTela} />}
        {tela === "editar" && <TelaEditar onNavegar={setTela} />}
      </div>
    </div>
  );
}