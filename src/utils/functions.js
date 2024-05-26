export function union(arr1_, arr2_, key) {
    let unionArray = [];
    let arr1 = arr1_.map(a => {return {...a}});
    let arr2 = arr2_.map(a => {return {...a}});
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (arr1[i].Time < arr2[j].Time) {
            arr1[i][key] = null
            unionArray.push(arr1[i]);
            i++;
        } else if (arr1[i].Time > arr2[j].Time) {
            arr2[j][key] = arr2[j].Value
            arr2[j].Value = null
            unionArray.push(arr2[j]);
            j++;
        } else {
            arr1[i][key] = arr2[j].Value
            unionArray.push(arr1[i]);
            i++;
            j++;
        }
    }

    while (i < arr1.length) {
        unionArray.push(arr1[i]);
        i++;
    }

    while (j < arr2.length) {
        arr2[j][key] = arr2[j].Value
        arr2[j].Value = null
        unionArray.push(arr2[j]);
        j++;
    }

    return unionArray;
}
