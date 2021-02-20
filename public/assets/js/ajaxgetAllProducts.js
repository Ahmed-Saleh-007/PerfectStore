async function getAllproducts(){
    console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    let res = await fetch("/products/productList.html/1");
    let resJson = await res.json();
    console.log(resJson);
    let data = resJson.data;
    console.log(data);
    if(data.length > 0){
        showRecipes(data);
        //console.log("data is"+data);
    }else{
        console.log("No Data To Display");
    }
}
getAllproducts();
function showRecipes(products){
        let data = ``;
        console.log(products);
        products.forEach(item => {
            data +=`
            <div class="col-xl-4 col-lg-4 col-md-6">
                    <div class="single-product mb-60">
                        <div class="product-img">
                            <img src="${item.productImage}" alt="">
                            <div class="new-product">
                                <span>New</span>
                            </div>
                        </div>
                        <div class="product-caption">
                            <div class="product-ratting">
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star low-star"></i>
                                <i class="far fa-star low-star"></i>
                            </div>
                            <h4><a href="/products/productDetails.html/${item.productID}" id="${item.productID}" class='details'>${item.name}</a></h4>
                            <div class="price">
                                <ul>
                                    <li>$${item.price}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            
            `
        });
        document.getElementById('data').innerHTML = data;
        getClasses();
}


function getClasses(){
    let btnClasses = document.getElementsByClassName('details');
    for(let i = 0;i<btnClasses.length ;i++){
        btnClasses[i].addEventListener('click',function(e){
            console.log(e.target.id);
           
        })
    }
}

getProductDetails(1);
async function getProductDetails(id){
    let res = await fetch("/products/productList.html/1");
    let resJson = await res.json();
    let data = resJson.data;
    if(data.productId == id){
        console.log(data);
    }
    
    // if(data.length > 0){
    //     showRecipes(data);
    //     //console.log("data is"+data);
    // }else{
    //     console.log("No Data To Display");
    // }
}