function growTree()
{
    document.getElementById("message").innerHTML = "Growing...";

    setTimeout(function()
    {
        document.getElementById("tree").src = "stage2.png";
    },1000);

    setTimeout(function()
    {
        document.getElementById("tree").src = "stage3.png";
    },2000);

    setTimeout(function()
    {
        document.getElementById("tree").src = "stage4.png";
    },3000);

    setTimeout(function()
    {
        document.getElementById("tree").src = "stage5.png";
        document.getElementById("message").innerHTML = "Tree Grown Successfully!";
    },4000);
}