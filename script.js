const main = document.querySelector('main')
const header = document.querySelector('header')

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
