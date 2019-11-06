const form = document.querySelector('form')
let url = 'https://source.unsplash.com/1920x1080/?'
const renderImageWrap = document.querySelector('.render-image-wrap')

// Spinner
const body = document.body
let spin = document.createElement('div')
spin.className = 'spin'

form.addEventListener('submit', submitForm, false)

// Get User search query
function submitForm(e){
    e.preventDefault()
    loadSpinner()
    let formData = new FormData(form)
    let image = formData.get('search')
    getImageData(image)
    form.reset()
}

// Fetch Data from api & user query
async function getImageData(img){
    try{
        let res = await fetch(url + img)
        let src = res.url
        createImage(img, src)
    } catch(error){
        console.warn(error)
    }
} 

// Create image from api data
function createImage(imgName, imgUrl){
    // Create Elements
    const imageContainer = document.createElement('div')
    const imageTag = document.createElement('img')
    const deleteImg = document.createElement('span')
    const a = document.createElement('a')
    
    // Set Attributes for delete Btn
    deleteImg.setAttribute('onclick', 'deleteImg(this)')
    deleteImg.innerHTML = '&Cross;'
    deleteImg.className = 'deleteImg'

    // Set Attributes for a tag
    a.className = 'link'
    a.href = imgUrl

    // Set Attributes for image & image container
    imageTag.title = imgName
    imageTag.src = imgUrl
    imageContainer.className = 'render-image'
    imageContainer.dataset.query = imgName

    // Create UI After Image loads   
    imageTag.onload = e => {
        closeSpinner()
        renderImageWrap.appendChild(imageContainer)
        imageContainer.appendChild(a)
        a.appendChild(imageTag)
        open_Close_Modal(a)
        imageContainer.appendChild(deleteImg)
    }
}

function deleteImg(img){
    img.parentElement.remove()
}

function open_Close_Modal(img){
    let modal = document.querySelector('.modal')
    
    // Open Modal
    img.onclick = e => {
        e.preventDefault()
        let src = e.target.src
        modal.parentElement.classList.add('zoom')
        modal.classList.add('zoom')
        modal.children[0].src = src
        createDownloadBtn(modal, src)
    }

    // Close Modal
    modal.onclick = e =>{
        if(modal.classList.contains('zoom')){
            modal.children[1].remove()
            modal.classList.remove('zoom')
            modal.parentElement.classList.remove('zoom')
        } else {
            createDownloadBtn(modal, modal.children[0].src)
        }
    }
}

function createDownloadBtn(modal, link){
    let download = document.createElement('a')
    let icon = document.createElement('i')

    // Any characters after (?) will be replaced
    let str = /\?.*/g
    let regex = link.replace(str, '')
    
    // Set Attributes
    download.className = 'download'
    download.download = 'your-image.jpg'
    download.setAttribute('href', regex)
    download.setAttribute('target', '_blank')
    icon.className = 'fas fa-download fa-4x'

    // Create download btn
    download.appendChild(icon)
    modal.appendChild(download)
}

function loadSpinner(){
    body.appendChild(spin)
}

function closeSpinner(){
    spin.classList.add('hide')
}