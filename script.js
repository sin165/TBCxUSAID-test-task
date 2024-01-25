const body = document.querySelector('body')
const main = document.querySelector('main')
const header = document.querySelector('header')
const menuButton = document.querySelector('.menu-btn')
const menuContainer = document.querySelector('#menu-container')
const backdrop = document.querySelector('.backdrop')

// scale to fit screen
let ratio = 1
const resize = () => {
    if(window.innerWidth < 1080) {
        ratio = window.innerWidth / 320
    } else {
        ratio = 1
    }
    main.style.transform = 'scale(' + ratio + ')'
    header.style.transform = 'scale(' + ratio + ')'
}
resize()
window.onresize = resize


// hide/show header when scrolling
let didScroll
let previousScrollY = 0
let delta = 5

window.onscroll = () => {
    didScroll = true
}

let hasScrolled = () => {
    let scrollY = window.scrollY
    if (Math.abs(previousScrollY - scrollY) <= delta) {
        return
    }
    if (scrollY > 0) {
        header.classList.add('transparent')
    } else {
        header.classList.remove('transparent')
    }
    if (scrollY > previousScrollY) {
        if(window.innerWidth <= 1080) {
            header.style.top = `-${header.offsetHeight * ratio}px`
        }
    } else {
        header.style.top = '0'
    }
    previousScrollY = scrollY
}

setInterval(() => {
    if(didScroll) {
        hasScrolled()
        didScroll = false
    }
}, 250)

// menu
const openMenu = () => {
    menuButton.onclick = closeMenu
    body.classList.add('menu-open')
    menuButton.classList.add('x')
    menuContainer.classList.add('displayed')
    setTimeout(() => {
        menuContainer.classList.add('expanded')
    }, 1)
}

const closeMenu = () => {
    menuButton.onclick = openMenu
    menuButton.classList.remove('x')
    menuContainer.classList.remove('expanded')
    setTimeout(() => {
        if(!menuContainer.classList.contains('expanded'))
        menuContainer.classList.remove('displayed')
        body.classList.remove('menu-open')
    }, 500)
}

menuButton.onclick = openMenu
backdrop.onclick = e => {
    if(e.target != backdrop) return
    menuButton.classList.remove('x')
    menuContainer.classList.remove('expanded')
    menuContainer.classList.remove('displayed')
    body.classList.remove('menu-open')
    menuButton.onclick = openMenu
}
