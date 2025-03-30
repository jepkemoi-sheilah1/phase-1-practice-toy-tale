document.addEventListener("DOMContentLoaded" , () => {
    console.log("JavaScript file loaded!");
   fetchToys();

});
function fetchToys(){
    fetch("http://localhost:3000/toys")
    .then (response => response.json())
    .then(toys => {
        toys.forEach(toy => renderToyCard(toy))

        //.catch(error => console.error("Error fetching toys:", error));
    })
    .catch(error => console.error("Error fetching toys:", error));
}
function renderToyCard(toy){
    const toyCollection =document.getElementById("toy-collection");

    const card  =  document.createElement("div");
    card.className = "card";
    //toys to have a valid number
    if (!toy.likes) toy.likes = 0;

    card.innerHTML =`<h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar">
    <p>${toy.likes} likes </p>
    <button class = "like-btn" id="${toy.id}"> like </button>`;
    //append collection 
    toyCollection.appendChild(card);
}
//adding new toy to the list
document.querySelector(".add-toy-form").addEventListener("submit",function(e){
    e.preventDefault();//prevent default 

    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;
    const newToy = {
        name:toyName,
        image:toyImage,
        likes:0,
    };
    fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body:JSON.stringify(newToy)
})
.then(response => response.json())
.then(toy => renderToyCard(toy)); // Add the new toy to the DOM

// Reset form inputs
e.target.reset();
});
document.addEventListener("click", function(e){
    if (e.target.className === "like-btn")
    {
        let toyCard = e.target.parentElement;
        let likesTag = toyCard.querySelector("p");
        let likes = parseInt(likesTag.textContent.split(" ")[0]) + 1;
 // Increase like count

        //get toy id 
        let toyId = e.target.id;
        console.log(`Toy ID: ${toyId}, New Likes: ${likes}`);//debbuging line
        // Update likes on the server
    fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ likes: likes })
      })
        .then(response => response.json())
        .then(updatedToy => {
            console.log("Updated Toy:", updatedToy);//debugging
          likesTag.textContent = `${updatedToy.likes} Likes`; // Update likes in DOM
        })
        .catch(error => console.error("Error:", error));
    }
  });
    
