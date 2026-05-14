import Navbar from '../components/Navbar/navbar.js';
import Footer from '../components/Footer/footer.js';

export default function SiteLayout({ children }){
    return(
      <>
        <Navbar/>
        <main>{children}</main> 
        <Footer />
      </>
    );
}