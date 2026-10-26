

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

      // Get the button thats curr active
      const currActive = document.querySelector(".tablink.active"); 

      // Make it inactive so that text changes
      currActive.classList.remove("active"); 

      // Change its icon to inactive
      currIcon = currActive.querySelector("img");
      currIcon.src = currIcon.src.replace("-active.svg", "-inactive.svg")

      // Swapping to new active button
      buttons[i].classList.add("active");

      // changing new icon to active 
      newIcon = buttons[i].querySelector("img");
      newIcon.src = newIcon.src.replace("-inactive.svg", "-active.svg")
    });
 }