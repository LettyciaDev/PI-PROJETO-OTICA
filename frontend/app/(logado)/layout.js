import Navbar from '../components/Navbar/navbar.js';
import Footer from '../components/Footer/footer.js';

export default function LogadoLayout({ children }){
    return(
      <>
        <Navbar/>
        <main>{children}</main> 
        <Footer />
      </>
    );
}