let resize = () => {
    let w = window.innerWidth < 1080 ? window.innerWidth : 1080
    body.style.transform = 'scale(' + (w / 320) + ')'
}

resize()

window.onresize = resize
