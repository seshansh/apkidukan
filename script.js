// console.log('====================================');
// console.log("Connected");
// console.log('====================================');
async function fetchData() {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function showTab(tabName) {
    const data = await fetchData();

    document.querySelectorAll('.tab-content').forEach(tabContent => {
        tabContent.style.display = 'none';
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('selected');
    });

    const selectedTabContent = document.getElementById(tabName);
    selectedTabContent.style.display = 'flex';

    const selectedTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    selectedTab.classList.add('selected');

    const category = data.categories.find(cat => cat.category_name.toLowerCase() === tabName);
    if (category) {
        const products = category.category_products;
        const tabContentElement = document.getElementById(tabName);
        tabContentElement.innerHTML = ''; // Clear previous content

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'card';
            productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">

            ${product.badge_text ? `<div style="position:absolute;padding:0 10px;top:10px;left:10px;background-color:white;border-radius:5px">
                    <p>${product.badge_text}</p>
                </div>`: ``}
            <div>
            <div style='display: flex; gap: 12px; align-item:center;'>
                <p style="font-size:20px;font-weight: 600;
                ">${product.title.length > 16 ? product.title.substr(0, 16) + "..  " : product.title}</p>
                <p style="margin-block:auto">⚫   ${product.vendor}</p>
            </div>
            <div style="display:flex;font-size:16px;font-weight:600;gap:16px;">
                <p>Rs ${product.price}.00</p>
                <p style="color:grey;
        text-decoration:line-through ;
                ">${product.compare_at_price || 'N/A'}.00</p>
                <p style="color:red">${calculatePercentageOff(product.price, product.compare_at_price)}% Off</p>
            </div>
            <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
            tabContentElement.appendChild(productElement);
        });
    }
}

function calculatePercentageOff(price, compareAtPrice) {
    if (!compareAtPrice) {
        return 0;
    }

    const percentageOff = ((compareAtPrice - price) / compareAtPrice) * 100;
    return Math.round(percentageOff);
}

showTab('men');