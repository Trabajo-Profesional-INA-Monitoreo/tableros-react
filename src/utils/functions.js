export function union(arr1, arr2) {
    let unionArray = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (arr1[i].Time < arr2[j].Time) {
            unionArray.push(
                {
                    Time: arr1[i].Time,
                    Value: arr1[i].Value,
                    Value2: null
                }
            );
            i++;
        } else if (arr1[i].Time > arr2[j].Time) {
            unionArray.push(
                {
                    Time: arr2[j].Time,
                    Value: null,
                    Value2: arr2[j].Value
                }
            );
            j++;
        } else {
            unionArray.push(
                {
                    Time: arr1[i].Time,
                    Value: arr1[i].Value,
                    Value2: arr2[j].Value
                }
            );
            i++;
            j++;
        }
    }

    while (i < arr1.length) {
        unionArray.push(arr1[i]);
        i++;
    }

    while (j < arr2.length) {
        unionArray.push(
            {
                Time: arr2[j].Time,
                Value2: arr2[j].Value
            }
        );
        j++;
    }

    return unionArray;
}