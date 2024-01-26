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
    }, 10)
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


// slider
const slider = document.querySelector('.slider')
const slides = document.querySelectorAll('.slide')
const slideButtons = document.querySelectorAll('.slide-btn')
const slidesContainer = document.querySelector('.slides-container')
const leftArrow = document.querySelector('.slider-arrow.left')
const rightArrow = document.querySelector('.slider-arrow.right')

let activeSlideIndex = 0
let slideChangeInProgress = false

const slideLeft = targetIndex => {
    if(slideChangeInProgress) return
    slideChangeInProgress = true
    slideButtons[activeSlideIndex].classList.remove('active')
    slideButtons[targetIndex].classList.add('active')
    slides[targetIndex].classList.add('right')
    slidesContainer.classList.add('sliding-left')
    setTimeout(() => {
        slidesContainer.classList.remove('sliding-left')
        slides[activeSlideIndex].classList.remove('active')
        slides[targetIndex].classList.remove('right')
        slides[targetIndex].classList.add('active')
        activeSlideIndex = targetIndex
        slideChangeInProgress = false
    }, 500)
}

const slideRight = targetIndex => {
    if(slideChangeInProgress) return
    slideChangeInProgress = true
    slideButtons[activeSlideIndex].classList.remove('active')
    slideButtons[targetIndex].classList.add('active')
    slides[targetIndex].classList.add('left')
    slidesContainer.classList.add('left')
    setTimeout(() => {
        slidesContainer.classList.add('sliding-right')
    }, 10)
    setTimeout(() => {
        slidesContainer.classList.remove('left', 'sliding-right')
        slides[activeSlideIndex].classList.remove('active')
        slides[targetIndex].classList.remove('left')
        slides[targetIndex].classList.add('active')
        activeSlideIndex = targetIndex
        slideChangeInProgress = false
    }, 500);
}

const changeSlide = targetIndex => {
    if(slideChangeInProgress) return
    slideChangeInProgress = true
    slideButtons[activeSlideIndex].classList.remove('active')
    slideButtons[targetIndex].classList.add('active')
    slides[activeSlideIndex].classList.add('fade')
    slides[targetIndex].classList.add('fade')
    setTimeout(() => {
        slides[targetIndex].classList.add('active')
        slides[targetIndex].classList.remove('fade')
    }, 10)
    setTimeout(() => {
        slides[activeSlideIndex].classList.remove('active', 'fade')
        activeSlideIndex = targetIndex
        slideChangeInProgress = false
    }, 1000)
}

slideButtons.forEach((button, index) => {
    button.onclick = () => {
        if(index === activeSlideIndex) return
        if(window.innerWidth < 1080) {
            if(index > activeSlideIndex) {
                slideLeft(index)
            } else {
                slideRight(index)
            }
        } else {
            changeSlide(index)
        }
    }
})

leftArrow.onclick = () => {
    let targetIndex = activeSlideIndex > 0 ? activeSlideIndex - 1 : 2
    changeSlide(targetIndex)
}

rightArrow.onclick = () => {
    let targetIndex = activeSlideIndex === 2 ? 0 : activeSlideIndex + 1
    changeSlide(targetIndex)
}

const slideFromLastToFirst = () => {
    let firstSlide = document.querySelector('.slide.first')
    slidesContainer.appendChild(firstSlide)
    slideLeft(0)
    setTimeout(() => {
        slidesContainer.insertBefore(firstSlide, slidesContainer.firstElementChild)
    }, 500)
}

const slideFromFirstToLast = () => {
    let firstSlide = document.querySelector('.slide.first')
    slidesContainer.appendChild(firstSlide)
    slideRight(2)
    setTimeout(() => {
        slidesContainer.insertBefore(firstSlide, slidesContainer.firstElementChild)
    }, 500)
}

const automaticSlide = () => {
    let targetIndex = activeSlideIndex === 2 ? 0 : activeSlideIndex + 1
    if(window.innerWidth < 1080) {
        if(targetIndex === 0) {
            slideFromLastToFirst()
        } else {
            slideLeft(targetIndex)
        }
    } else {
        changeSlide(targetIndex)
    }
}

let sliderInterval = setInterval(automaticSlide, 3000)

slider.onmouseover = () => {
    clearInterval(sliderInterval)
}

slider.onmouseleave = () => {
    sliderInterval = setInterval(automaticSlide, 3000)
}

let swipeStartX
let swipeInProgress = false

slider.addEventListener('touchstart', e => {
    swipeStartX = e.touches[0].clientX
})

slider.addEventListener('touchmove', e => {
    if(swipeInProgress) return
    let currentX = e.touches[0].clientX;
    let deltaX = currentX - swipeStartX;
    if (deltaX < 0) {
        if(-deltaX > 50) {
            swipeInProgress = true
            let targetIndex = activeSlideIndex === 2 ? 0 : activeSlideIndex + 1
            if(targetIndex > 0) {
                slideLeft(targetIndex)
            } else {
                slideFromLastToFirst()
            }
        }
    } else {
        if(deltaX > 50) {
            swipeInProgress = true
            let targetIndex = activeSlideIndex > 0 ? activeSlideIndex - 1 : 2
            if(targetIndex === 2) {
                slideFromFirstToLast()
            } else {
                slideRight(targetIndex)
            }
        }
    }
})

slider.addEventListener('touchend', () => {
    swipeInProgress = false
})
