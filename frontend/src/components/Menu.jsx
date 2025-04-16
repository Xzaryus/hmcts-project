
function Menu ({openForm, setFilter, filter}) {

    return (
        <header>
            <ul id="menu" className="top">
                <li className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All tasks
                </li>
                <li className={filter === 'incomplete' ? 'active' : ''}
                    onClick={() => setFilter('incomplete')}
                >
                    Incomplete tasks
                </li>
                <li className={filter === 'complete' ? 'active' : ''}
                    onClick={() => setFilter('complete')}
                >
                    Completed tasks
                </li>
                <li onClick={openForm}>Add task</li>
            </ul>
        </header>
    )
}

export default Menu