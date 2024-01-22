document
  .getElementById("left-menu-button")
  .addEventListener("click", async () => {
    var leftMenu = document.getElementById("left-menu")
    if (leftMenu.style.display === "block") {
        leftMenu.style.display = "none";
    } else {
        leftMenu.style.display = "block";
    }
  });

  document
  .getElementById("right-menu-button")
  .addEventListener("click", async () => {
    var rightMenu = document.getElementById("right-menu")
    if (rightMenu.style.display === "block") {
        rightMenu.style.display = "none";
    } else {
        rightMenu.style.display = "block";
    }
  });