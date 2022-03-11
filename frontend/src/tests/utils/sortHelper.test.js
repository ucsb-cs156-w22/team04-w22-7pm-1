import { compareValues } from "main/utils/sortHelper"

describe("sortHelper tests", () => {
  
   var singers = [];
   var singers2 = [];
   var singers3 = [];
   var singers4 = [];

   const tyler = { name: 'Steven Tyler', band: 'Aerosmith', born: 1948 };
   const carpenter = { name: 'Karen Carpenter', band: 'The Carpenters', born: 1950 };
   const cobain = { name: 'Kurt Cobain', band: 'Nirvana', born: 1967 };
   const nicks = { name: 'Stevie Nicks', band: 'Fleetwood Mac', born: 1948 };
   const nicksempty = { name: 'Stevie Nicks', band: 'Fleetwood Mac' };
   const tylerCaps = { name: 'Steven Tyler', band: 'AEROSMITH', born: 1948 };

   const alower = {name: 'a'};
   const aUpper = {name: 'A'};


  beforeEach(() => {
    singers = [ tyler, carpenter, cobain, nicks ]
    singers2 = [tyler, tyler]
    singers3 = [tyler, carpenter, cobain, nicksempty ]
    singers4 = [alower, aUpper]
  });

  test("should sort by name", async () => {
    singers.sort(compareValues('name'));
    expect(singers).toEqual( [carpenter, cobain, tyler, nicks] )
  });

  test("should sort by band, descending", async () => {
    singers.sort(compareValues('band', 'desc'));
    expect(singers).toEqual( [carpenter, cobain, nicks, tyler] )
  });

  test("should sort by year born", async () => {
    singers.sort(compareValues('born'));
    expect(singers).toEqual( [tyler, nicks, carpenter, cobain] )
  });

  test("should not sort at all", async () => {
    singers.sort(compareValues('potato'));
    expect(singers).toEqual( singers )
  });

  test("sort band, asc left blank", async () =>{
    singers.sort(compareValues('name', ""));
    expect(singers).toEqual( [carpenter, cobain, tyler, nicks] )
  });

  test("same value", async () => {
    singers2.sort(compareValues('born'));
    expect(singers2).toEqual( [tyler, tyler] )
  });

  test("blank compare", async () =>{
    singers.sort(compareValues(''));
    expect(singers).toEqual( singers )
  });

  test("blank compare", async () =>{
    singers3.sort(compareValues('born'));
    expect(singers3).toEqual( [tyler, carpenter, cobain, nicksempty] )
  });

  test("should sort by band Caps", async () => {
    singers4.sort(compareValues('name'));
    expect(singers4).toEqual( [ alower, aUpper] )
  });
  
});