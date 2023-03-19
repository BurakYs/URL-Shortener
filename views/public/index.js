const form = document.querySelector('form');
const input = document.querySelector('#url');
const shortUrl = document.querySelector('#short-url');
const toggleButton = document.querySelector('#toggle-theme');
const root = document.documentElement;
const copyClass = document.querySelector(".copy")
window.addEventListener("load", () => {
    const theme = window.localStorage.getItem("theme") || "light"
    if (theme === "light") {
        root.style.setProperty('--background-color', '#f0f0f0');
        root.style.setProperty('--form-background-color', '#fff');
        root.style.setProperty('--text-color', '#1e88e5');
        root.style.setProperty('--button-color', '#1e88e5');
        root.style.setProperty('--button-text-color', '#fff');
        toggleButton.textContent = 'Switch to Dark Mode';
    } else if (theme === "dark") {
        root.style.setProperty('--background-color', '#121212');
        root.style.setProperty('--form-background-color', '#1d1d1d');
        root.style.setProperty('--text-color', '#fff');
        root.style.setProperty('--button-color', '#1e88e5');
        root.style.setProperty('--button-text-color', '#fff');
        toggleButton.textContent = 'Switch to Light Mode';
    }
})
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value;
    if (url.trim() == '') {
        input.classList.add('error');
        setTimeout(function () {
            input.classList.remove('error');
        }, 300);
        return false;
    }
    if (!new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i').test(url)) {
        document.querySelector(".hidden").style.display = "block"
        return shortUrl.innerHTML = `Link is invalid.`;
    }


    fetch('/api/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ o: url })
    })
        .then(response => response.json())
        .then(data => {
            if (data === false) {
                document.querySelector(".hidden").style.display = "block"
                shortUrl.innerHTML = `Link is invalid.`;
            }
            document.querySelector(".hidden").style.display = "block"
            shortUrl.innerHTML = `${data.s}`;
        })
        .catch(error => console.error(error));
});
copyClass.addEventListener("click", () => {
    if (copyClass.innerHTML !== "Link is invalid.") {
        navigator.clipboard.writeText(`${window.location.origin}/${copyClass.innerHTML}`)
    } else return false;
})
toggleButton.addEventListener("click", () => {
    const theme = window.localStorage.getItem("theme") || "light"
    console.log(theme === "dark")
    if (theme === "light") {
        window.localStorage.setItem("theme", "dark")
        root.style.setProperty('--background-color', '#121212');
        root.style.setProperty('--form-background-color', '#1d1d1d');
        root.style.setProperty('--text-color', '#fff');
        root.style.setProperty('--button-color', '#1e88e5');
        root.style.setProperty('--button-text-color', '#fff');
        toggleButton.textContent = 'Switch to Light Mode';
    } else {
        window.localStorage.setItem("theme", "light")
        root.style.setProperty('--background-color', '#f0f0f0');
        root.style.setProperty('--form-background-color', '#fff');
        root.style.setProperty('--text-color', '#1e88e5');
        root.style.setProperty('--button-color', '#1e88e5');
        root.style.setProperty('--button-text-color', '#fff');
        toggleButton.textContent = 'Switch to Dark Mode';
    }
});
