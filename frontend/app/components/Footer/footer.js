import styles from "./footer.module.css";

export default function Footer(){
    return(
        <footer className={styles.footer}>
        
        <div className={styles.meio}>
            <div className={styles.vizzo}>
                <span>VIZZO ÓTICA</span>
                <p>Especialistas em saúde ocular e óculos.
                    Encontre o óculos perfeito para você.
                </p>
            </div>

            <div className={styles.listona}>
                <h1>PRODUTOS</h1>
                <ul className={styles.listinha}>
                    <li>Armações Femininas</li>
                    <li>Armações Masculinas</li>
                    <li>Óculos Infantil</li>
                    <li>Óculos Solar</li>
                    <li>Lentes de Contato</li>
                </ul>
            </div>

            <div className={styles.listona}>
                <h1>SERVIÇOS</h1>
                <ul className={styles.listinha}>
                    <li>Exame de Vista</li>
                    <li>Manuntenção de Óculos</li>
                    <li>Adaptação de Lentes</li>
                    <li>Convenio</li>
                </ul>
            </div>

            <div className={styles.listona}>
                <h1>CONTATO</h1>
                <ul className={styles.listinha}>
                    <li>Parnamirim</li>
                    <li><a href="https://wa.me/5581984384624">(81) 98438-4624</a></li>
                </ul>
            </div>
        </div>

        <div className={styles.baixo}>
            <p>2026 Vizzo Ótica © - Todos os direitos reservados</p>
        </div>

        </footer>
    );
}