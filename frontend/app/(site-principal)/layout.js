import Navbar from '../components/Navbar/navbar.js';

export default function SiteLayout({ children }){
    return(
      <>
        <Navbar/>
        <main>{children}</main> 
      </>
    );
}