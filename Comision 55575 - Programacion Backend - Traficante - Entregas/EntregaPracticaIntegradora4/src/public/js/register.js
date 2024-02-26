const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => {
        const normalizedKey = key.toLowerCase();  // Normaliza el nombre de la propiedad a minúsculas
        obj[normalizedKey] = value;
    });
    fetch('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(result => {
        if (result.status == 201) {
            window.location.replace('/api/products');
        }
    })
});