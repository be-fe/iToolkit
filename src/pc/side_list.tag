<side-list>
    <ul >
        <li each={ data }>
            <img src={ logoUrl } if={ isLogo }>
            <span>{ name }</span>
        </li>
    </ul>
</side-list>