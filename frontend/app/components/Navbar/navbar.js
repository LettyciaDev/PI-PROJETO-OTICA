import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { LiaUserSolid } from "react-icons/lia";
import { IoIosSearch } from "react-icons/io";
import { BsHandbag } from "react-icons/bs";

export default function Navbar() {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarInterna}>
          <div className={styles.esquerda}>
            <Image src="/Navbar/logo.png" className={styles.logo} width={184} height={184} alt="Logo" />
          </div>
          <div className={styles.centro}>
            <Link href="/home" className={styles.linkNav}>HOME</Link>
            <Link href="/produtos" className={styles.linkNav}>PRODUTOS</Link>
            <Link href="/agendar-exames" className={styles.linkNav}>AGENDAR EXAMES</Link>
            <Link href="/contato" className={styles.linkNav}>CONTATO</Link>
          </div>
          <div className={styles.direita}>
            <Link href="/pesquisa" className={styles.linkNav}>
              <IoIosSearch className={styles.imgNav} size={30} />
            </Link>
            <Link href="/carrinho" className={styles.linkNav}>
              <BsHandbag className={styles.imgNav} size={26} />
            </Link>
            <Link href="/perfil" className={styles.linkNav}>
              <LiaUserSolid className={styles.imgNav} size={35} />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
