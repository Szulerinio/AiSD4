// generate random int
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate given number of random containers
function getRandomContainers(amount, maxSize = 1000, maxValue = 1000) {
  // const maxSize = 10; // fixed maxSize of container
  // const maxValue = 10; // fixed maxVize of container

  const containers = [];
  for (let i = 0; i < amount; i++) {
    let temp = getRandomIntInclusive(1, maxSize);
    const element = {
      size: temp,
      value: getRandomIntInclusive(1, 50 * temp),
    };
    containers.push(element);
  }
  return containers;
}

function compare(a, b) {
  const ra = a.value / a.size;
  const rb = b.value / b.size;
  if (ra > rb) return -1;
  if (ra < rb) return 1;
  // a równe b
  return 0;
}

function greedy(containers, maxSize) {
  const t0 = performance.now();
  let backpack = { value: 0, filled: 0, elements: [] };
  containers.sort(compare);
  for (let i = 0; i < containers.length; i++) {
    // console.log(maxSize, backpack.filled + containers[i].size);
    if (maxSize >= backpack.filled + containers[i].size) {
      backpack.filled += containers[i].size;
      backpack.value += containers[i].value;
      backpack.elements.push(containers[i]);
      // console.log(backpack);
    }
  }
  const t1 = performance.now();
  // console.log(`zachłanne zajęło ${t1 - t0} ms.`);

  // console.log(backpack);
  const time = t1 - t0;
  return [backpack, time];
}

function dynamic(containers, maxSize) {
  const t0 = performance.now();
  let array = [[]];
  for (let i = 0; i < maxSize + 1; i++) {
    array[0][i] = 0;
  }
  for (let i = 1; i < containers.length + 1; i++) {
    array[i] = [0];
  }
  for (let i = 1; i < containers.length + 1; i++) {
    for (let j = 1; j < maxSize + 1; j++) {
      const currentContainer = containers[i - 1];
      array[i][j] = 0;
      array[i][j] = 0;
      if (j < currentContainer.size) array[i][j] = array[i - 1][j];
      else
        array[i][j] =
          array[i - 1][j] >
          array[i - 1][j - currentContainer.size] + currentContainer.value
            ? array[i - 1][j]
            : array[i - 1][j - currentContainer.size] + currentContainer.value;
    }
  }
  // console.table(array);     <= shows table

  // checking what elements in backpack

  let flag = 1;
  let x = array[0].length - 1;
  let y = array.length - 1;
  let backpack = { value: 0, filled: 0, contained: [] };
  while (array[y][x] == array[y][x - 1]) {
    x--;
  }
  backpack.value = array[y][x];
  backpack.filled = x;
  while (y > 0) {
    if (array[y][x] == array[y - 1][x]) y--;
    else if (array[y][x] == array[y][x - 1]) x--;
    else {
      y--;
      backpack.contained.push(containers[y]);
      x -= containers[y].size;
    }
  }
  const t1 = performance.now();
  const time = t1 - t0;
  // console.log(`dynamiczne zajęło ${t1 - t0} ms.`);
  // console.log(backpack);
  return [backpack, time];
}
let puppet = [
  {
    size: 4,
    value: 2,
  },
  {
    size: 5,
    value: 4,
  },
  {
    size: 4,
    value: 3,
  },
  {
    size: 2,
    value: 4,
  },
];
// let aa = getRandomContainers(50);
// let g = greedy(aa, 8000);
// let d = dynamic(aa, 8000);
// console.log("błąd: ", ((d.value - g.value) * 100) / d.value + "%");

function constAmount(shipSize) {
  // const amount ilość
  let containers = getRandomContainers(50);
  // console.log(containers);
  let g = greedy(containers, shipSize);
  let d = dynamic(containers, shipSize);
  let error = ((d[0].value - g[0].value) * 100) / d[0].value;
  // console.log("błąd: ", ((d[0].value - g[0].value) * 100) / d[0].value + "%");
  return { greedyTime: g[1], dynamicTime: d[1], error: error };
}
function constSize(amount) {
  // const size ładowność
  let containers = getRandomContainers(amount);
  // console.log(containers);
  let g = greedy(containers, 5000);
  let d = dynamic(containers, 5000);
  let error = ((d[0].value - g[0].value) * 100) / d[0].value;
  // console.log("błąd: ", ((d[0].value - g[0].value) * 100) / d[0].value + "%");
  return { greedyTime: g[1], dynamicTime: d[1], error: error };
}
function multi(fun, data) {
  showArray = [];
  for (let i = 1; i < 16; i++) {
    // odpalanie 15 argumentów
    let sum = { dynamicTime: 0, greedyTime: 0, error: 0 };
    let repetitions = 100;
    for (let l = 0; l < repetitions; l++) {
      // odpalanie x razy i liczenie średniej
      const element = fun(data * i);
      sum.dynamicTime += element.dynamicTime;
      sum.greedyTime += element.greedyTime;
      sum.error += element.error;
      // console.log(element);
    }
    console.log(sum);
    sum.dynamicTime /= repetitions;
    sum.greedyTime /= repetitions;
    sum.error /= repetitions;
    showArray.push(sum);
  }

  console.table(showArray);
}
