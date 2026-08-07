let highest = 0;
let topperName = "";

function addStudent(){

    let name = document.getElementById("name").value;

    let phy = Number(document.getElementById("phy").value);

    let chem = Number(document.getElementById("chem").value);

    let math = Number(document.getElementById("math").value);

    let total = phy + chem + math;

    let per = total / 3;

    document.getElementById("record").innerHTML +=
    "<tr><td>" + name + "</td><td>" + phy + "</td><td>" + chem + "</td><td>" + math + "</td><td>" + total + "</td><td>" + per.toFixed(2) + "</td></tr>";

    if(total > highest){

        highest = total;
        topperName = name;

        document.getElementById("topper").innerHTML = "Topper : " + topperName;

    }

    document.getElementById("name").value = "";
    document.getElementById("phy").value = "";
    document.getElementById("chem").value = "";
    document.getElementById("math").value = "";

}