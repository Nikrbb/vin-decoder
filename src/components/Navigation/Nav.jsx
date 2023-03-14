import "./nav.scss"
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


const Nav = () => {
    const [slug, updateSlug] = useState("");
    const [disabledClass, updateDisabledClass] = useState(" disabled");
    // const [activeLink, updateActiveLink] = useState("")
    const location = useLocation();

    useEffect(() => {
        if ( location.pathname.includes('variables/') && !location.pathname.includes('404') ) {

            const id = location.pathname.slice(11);

            if (id.length < 4) {
                updateSlug(+id);
                updateDisabledClass("");
            } else {
                updateSlug(null);
                updateDisabledClass(" disabled");
            }


        } else if (location.pathname.includes('404') ) {

            updateSlug("");
            updateDisabledClass(" disabled");

        }

    }, [location])

    return <div>
        <nav className='nav'>
            <Link
                className={"nav__link" + (location.pathname === "/decoder" ? " active" : "")}
                to='/decoder'>
                Vin Decoder
            </Link>
            <Link
                className={"nav__link" + (location.pathname === "/variables" ? " active" : "")}
                to='/variables'>
                Variables
            </Link>
            <Link
                // className={'nav__link' + disabledClass + (location.pathname === ("/variables/" + slug) ? " active" : "")}
                className={'nav__link' + (location.pathname === ("/variables/" + slug) ? " active" : "")}
                to={slug ? ('/variables/' + slug) : "/variables/0"}>
                {"ID: " + (slug ? slug : "")}
            </Link>
        </nav>
    </div>
}
export default Nav;
