import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { LiaUserSolid } from "react-icons/lia";
import { IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";

export default function Navbar() {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarInterna}>
          <div className={styles.esquerda}>
            <Image src="/Navbar/vizzologo.png" className={styles.logo} width={200} height={200} alt="Vizzo Logo" priority />
          </div>
          <div className={styles.centro}>
            <Link href="/home" className={styles.linkNav}>HOME</Link>
            <Link href="/produtos" className={styles.linkNav}>PRODUTOS</Link>
            <Link href="/agendar-exames" className={styles.linkNav}>AGENDAR EXAMES</Link>
            <Link href="/contato" className={styles.linkNav}>CONTATO</Link>
          </div>
          <div className={styles.direita}>
            <Link href="/pesquisa" className={styles.linkNavIcone}>
            <div className={styles.containerIcone}>
              <IoIosSearch size={50} />
            </div>
            </Link>
            <Link href="/carrinho" className={styles.linkNavIcone}>
              <div className={styles.containerIcone}>
                <IoBagOutline size={50} />
              </div>
            </Link>
            <Link href="/perfil" className={styles.linkNavIcone}>
            <div className={styles.containerIcone}>
              <LiaUserSolid size={55} />
            </div>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
