export default function Navbar() {
    return(
        <div className ="bg-black h-16">
            <ul className = "flex flex-row text-white justify-around items-center h-full">
                <li>Logo Placeholder</li>
                <li>
                    <input type="text" placeholder="Search for a movie" className ="border border-white p-2"/>
                </li>
                <li>Find a theather</li>
                <li>Movies</li>
                <li>Promos & Rewards</li>
                <li>Showtimes</li>
                <li>Log-in</li>
            </ul>
        </div>
    )
}
