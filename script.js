

function openCity(tab) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Show the specific tab content
  document.getElementById(tab).style.display = "block";
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// Logic to handle color changes in NAV bar when switching tabs
const buttons = document.querySelectorAll(".tablink")

 for(let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {

      console.log("Clicked: ", buttons[i].innerText)
      const currActive = document.querySelector(".tablink.active") //get the button thats curr active

      currActive.classList.remove("active"); //were removing the 'active' word from the class

      buttons[i].classList.add("active") // swapping to new active button
    });
 }