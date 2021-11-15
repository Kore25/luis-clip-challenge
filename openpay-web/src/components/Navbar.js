import { Link } from 'react-router-dom';

export default function Navbar() {
    return (        
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">                    
                <Link className='btn btn-light' to="/">Customer App</Link>                
            </div>
        </nav>        
    )
}
