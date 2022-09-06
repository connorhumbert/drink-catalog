// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
 
// const Record = (props) => (
//  <tr>
//    <td>{props.record.name}</td>
//    <td>{props.record.position}</td>
//    <td>{props.record.level}</td>
//    <td>
//      <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
//      <button className="btn btn-link"
//        onClick={() => {
//          props.deleteRecord(props.record._id);
//        }}
//      >
//        Delete
//      </button>
//    </td>
//  </tr>
// );
 
// export default function RecordList() {
//  const [records, setRecords] = useState([]);
 
//  // This method fetches the records from the database.
//  useEffect(() => {
//    async function getRecords() {
//      const response = await fetch(`https://mern-cocktail.herokuapp.com/record/`);
 
//      if (!response.ok) {
//        const message = `An error occurred: ${response.statusText}`;
//        window.alert(message);
//        return;
//      }
 
//      const records = await response.json();
//      setRecords(records);
//    }
 
//    getRecords();
 
//    return;
//  }, [records.length]);
 
//  // This method will delete a record
//  async function deleteRecord(id) {
//    await fetch(`https://mern-cocktail.herokuapp.com/${id}`, {
//      method: "DELETE"
//    });
 
//    const newRecords = records.filter((el) => el._id !== id);
//    setRecords(newRecords);
//  }
 
//  // This method will map out the records on the table
//  function recordList() {
//    return records.map((record) => {
//      return (
//        <Record
//          record={record}
//          deleteRecord={() => deleteRecord(record._id)}
//          key={record._id}
//        />
//      );
//    });
//  }
 
//  // This following section will display the table with the records of individuals.
//  return (
//    <div>
//      <h3>Cocktail List</h3>
//      <table className="table table-striped" style={{ marginTop: 20 }}>
//        <thead>
//          <tr>
//            <th>Name</th>
//            <th>Position</th>
//            <th>Level</th>
//            <th>Action</th>
//          </tr>
//        </thead>
//        <tbody>{recordList()}</tbody>
//      </table>
//    </div>
//  );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from './Header';
import Dropdown from './Dropdown';
import Button from "./Button";
import Cocktail from "./Cocktail";
import Form from "./Form";
import Matrix from "./Matrix";
import Popup from "./Popup";

export default function RecordList() {

  const Drinks = 
  [
      //"Whiskey/Rye/Bourbon"
      {booze: "Whiskey/Rye/Bourbon", name: "Old Fashioned ", ingredients: ['2 oz bourbon ', '1/4 oz simple syrup ', '2 dashes angostura bitters', 'Garnish: Orange twist']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Fairmont Old-Fashioned", ingredients: ['1 oz bourbon', '1 oz Mount Gay Black Barrel Rum', '1/4 oz simple syrup', '2 dashes angostura bitters', 'Garnish: Orange wheel', '•Substitute fig vodka for rum for fig old fashioned ']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Ocean house", ingredients: ['Makers', 'Orange and black walnut bitters', 'Coffee syrup']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Manhattan ", ingredients: ['2 1/4 oz bourbon/rye', '3/4 oz sweet vermouth', '2 dashes angostura bitters', 'Optional: 1 dash orange bitters', 'Garnish: Lemon twist/cherries ']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Employees Only Manhattan", ingredients: ['1 1/2 oz rye whiskey', '1 1/2 oz sweet vermouth', '1/2 oz grand marnier', '3 dashes aromatic bitters']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Fig Manhattan ", ingredients: ['2 oz fig infused bourbon', '1 oz vanilla liquor', '2-3 dashes aromatic bitters']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Man of War", ingredients: ['2 oz bourbon', '1 oz cointreau', '1 oz sweet vermouth', '1 oz lime juice']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Harvard", ingredients: ['1 1/2 oz brandy', '3/4 oz sweet vermouth ', '2 tsp lemon juice (.3 oz)', '1 tsp grenadine (.15 oz)', '1 dash aromatic bitters']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Whiskey Smash", ingredients: ['2 oz bourbon', '1/2 lemon (muddled) (3/4 oz)', '3/4 oz simple syrup', '10 mint leaves ', 'Garnish: Mint sprig']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Prospector’s Smash", ingredients: ['2 oz bourbon', '1/4 oz ginger liqueur ', '3/4 oz lemon juice', '1/2 oz honey syrup', '10 mint leaves']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Old Pal", ingredients: ['1 oz rye', '1 oz Campari ', '1 oz dry vermouth ', 'Optional: 3/4 oz lemon juice', 'Garnish: Lemon twist']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Boulevardier", ingredients: ['1 1/4 oz rye', '1 oz Campari ', '1 oz sweet vermouth ', 'Optional: 3/4 oz lemon juice', 'Garnish: Orange twist']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Mint Julep", ingredients: ['1/4 oz simple syrup', '8 mint leaves (muddle w syrup)', 'Pack w ice and stir', '2 oz bourbon', 'Pack w ice']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Whiskey Sour", ingredients: ['2 oz rye whiskey/bourbon', '3/4 oz lemon juice', '3/4 oz simple syrup', '1 egg white', 'Optional: Garnish w 3 drops angostura bitters', 'Garnish: Orange slice, cherry', 'New York Sour: float red wine']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Fizz", ingredients: ['1 1/2 oz bourbon', '1/4 oz frangelico', '1/4 oz amaretto', '1/2 oz simple syrup', '1 oz club sode']  },
      {booze: "Whiskey/Rye/Bourbon", name: "French", ingredients: ['1 oz bourbon', '1/2 oz lemon juice', '1/4 oz simple syrup', '2 oz beer to top']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Blood and Sand", ingredients: ['1 3/4 oz blended scotch ', '1/4 oz cherry liqueur ', '1/4 oz sweet vermouth ', '1/2 oz orange juice', '1/2 oz lemon juice']  },
      {booze: "Whiskey/Rye/Bourbon", name: "“Improved” Blood and Sand", ingredients: ['1 1/2 oz scotch', '3/4 oz cherry liqueur ', '3/4 oz sweet vermouth ', '3/4 oz orange juice', '1/4 oz lemon juice', '1/4 oz simple syrup']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Rob Roy (Scotch Manhattan)", ingredients: ['2 1/4 oz scotch', '3/4 oz sweet vermouth', '3 dashes angostura bitters', 'Optional: 1 dash orange bitters', 'Garnish: brandied cherries ']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Kentucky Mule", ingredients: ['2 oz rye/bourbon', '1/2 oz lime juice', 'Optional: 1/2 oz simple syrup', '4 oz ginger beer']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Gold Rush", ingredients: ['2 oz bourbon', '3/4 oz lemon juice', '3/4 oz honey syrup']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Gold Rush", ingredients: ['1 1/2 oz bourbon', '1 oz Domaine De Canton', '1/2 oz lemon juice ', 'Garnish: Luxardo cherry']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Halekulani", ingredients: ['1 1/2 oz bourbon', '1/2 oz lime juice', '1/2 oz orange juice', '1/2 oz pineapple juice', '1/4 oz simple syrup', '1 barstool grenadine ', '1 dash aromatic bitters']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Summer Breeze", ingredients: ['1 orange slice', 'Splash Cointreau ', '2 oz bourbon', '2 oz ginger ale']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Bulldog Smash", ingredients: ['2 oz bourbon', '1/4 oz simple syrup ', '3/4 oz Cointreau ', '1/2 Lemon', '1/2 Peach', '6 mint leaves', 'Garnish: Mint sprig']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Big River Smash ", ingredients: ['1 oz bourbon', '1 oz cognac ', '3/4 oz lemon juice', '1/4 oz dry curaçao syrup ', '1/2 simple syrup', '1 strawberry', 'Terragon sprig', 'Garnish: Orange peel']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Brown Derby", ingredients: ['1 1/2 oz bourbon', '1 oz grapefruit juice', '1/2 oz honey syrup', 'Garnish: Grapefruit twist']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Kentucky Buck", ingredients: ['2 oz bourbon', '3/4 oz lemon juice', '2 dashes angostura bitters', 'Ginger beer to top']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Expat", ingredients: ['2 oz bourbon', '1 oz lime juice', '3/4 oz simple syrup', '6 muddled mint leaves', '2 dashes angostura bitters', 'Garnish: mint leaves']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Sazerac", ingredients: ['1/4 oz absinthe (Rinsing)', '2 oz rye', '1/4 oz simple syrup', '4 dashes peychaud’s bitters', 'Garnish: Lemon twist ']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Toronto", ingredients: ['2 oz rye', '1/4 oz simple syrup ', '1/4 oz Fernet Branca', '2 dashes angostura bitters', 'Garnish: Orange twist']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Suffering Bastard", ingredients: ['1 oz bourbon', '1 oz london dry gin', '1/2 oz lime juice', '2 dashes angostura bitters', 'Ginger beer (To top)', 'Garnish: Mint sprig']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Vieux Carré", ingredients: ['3/4 oz rye', '3/4 oz cognac', '3/4 oz sweet vermouth', '1/2 oz benedictine liqueur ', '4 dashes Dale DeGroff’s pimento aromatic bitters', '(Or 2 dashes paychards and 2 dashes angostura)', 'Garnish: Maraschino Cherry or lemon twist']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Bourbon Spritz", ingredients: ['2 oz bourbon', '1 oz aperol ', '1 oz prosecco', '3/4 oz lemon juice', '1/4 oz simple syrup', 'Garnish: orange wedge']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Cold Brew Tini", ingredients: ['2 oz Jameson Cold Brew', '1 oz cold brew coffee', '1/2 oz simple syrup']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Cold Brew Old Fashioned", ingredients: ['1 1/2 oz bourbon', '1/4 oz maple syrup', '4 dashes black walnut bitters', '1 1/2 oz cold brew coffee', 'Smoke: Cinnamon stick']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Irish Coffee", ingredients: ['1 1/2 oz Irish whiskey', '3/4 oz demerara syrup', '4 oz hot coffee', 'Heavy cream to top', 'Garnish: Grated nutmeg', '']  },
      {booze: "Whiskey/Rye/Bourbon", name: "Bourbini", ingredients: ['1 oz bourbon', '2 dashes peach bitters', '5 oz Mathilde Peche peach liqueor', 'sparkling wine']  },
  
      //Tequila
      {booze: "Tequila", name: "Margarita ", ingredients: ['2 oz tequila (blanco)', '1 oz cointreau ', '3/4 oz lime juice', '1/4 - 1/2 oz agave syrup', 'Optional: 1 1/2 oz juice (pineapple/orange/...)', 'Garnish: salt/lime wedge']  },
      {booze: "Tequila", name: "Margarita Single", ingredients: ['2 oz tequila', '2 oz orange juice', '1 oz lime juice ', '3/4 oz triple sec grand marnein ', 'Agave sugar (1/4 oz)', 'Water (1/4 oz)']  },
      {booze: "Tequila", name: "Tommy’s Margarita", ingredients: ['2 oz tequila (blanco) ', '1 oz lime juice', '1/2 oz agave syrup', 'Garnish: Lime wedge']  },
      {booze: "Tequila", name: "Coconut Margarita ", ingredients: ['1 1/2 oz tequila', '3/4 oz orange liqueur ', '1 1/2 oz coconut milk', '4 oz coconut water']  },
      {booze: "Tequila", name: "Ginger Margarita ", ingredients: ['1 1/2 oz tequila (blanco)', '1 oz Domaine De Canton (ginger liqueur)', '1/2 oz lime juice', 'Garnish: Lime wedge']  },
      {booze: "Tequila", name: "St. Germain Margarita", ingredients: ['2 1/2 oz blanco tequila ', '1 1/2 oz St Germain', '1 oz lime juice', 'Garnish: Lime wedge']  },
      {booze: "Tequila", name: "Tequila Sunrise", ingredients: ['1 1/2 oz tequila', '4 oz Orange Juice', '1/2 oz lime juice', '1/4 oz Grenadine syrup', 'Garnish: Orange slice, cherry']  },
      {booze: "Tequila", name: "Paloma", ingredients: ['2 oz tequila', '1/2 oz lime juice', '1/2 oz simple syrup', 'Grapefruit soda (up to 6 oz) to top or 2 oz grapefruit juice and top with sparkling water', 'Garnish: Lime wheel']  },
      {booze: "Tequila", name: "My Paloma (cranberry)", ingredients: ['2 oz tequila', '1 oz cointreau ', '1/2 oz lime juice', '1/2 oz simple syrup', '2 dashes aromatic bitters', '2 oz cranberry juice', 'Optional: Sparkline water to top']  },
      {booze: "Tequila", name: "Pomegranate Paloma", ingredients: ['1 oz tequila (amber) (casamigos reposado)', '1 oz cointreau', '1 oz pomegranate juice', '3/4 oz grapefruit juice', '1/4 oz lemon juice', '2 dashes angostura bitters', 'Garnish: Salted rim/half lemon wheel']  },
      {booze: "Tequila", name: "Cantarito", ingredients: ['2 oz tequila', '1/2 oz grapefruit juice', '1/2 oz orange juice', '1/2 oz lime juice', 'Pinch of salt', '3 oz grapefruit soda (To top)', 'Garnish: Citrus slice']  },
      {booze: "Tequila", name: "Tequini", ingredients: ['2 1/2 oz tequila', '1/2 oz dry vermouth ', '1/2 oz lime juice', '1 dash angostura bitters', 'Garnish: Lemon twist ']  },
      {booze: "Tequila", name: "Añejo Old Fashioned", ingredients: ['2 oz añejo', '1/4 oz agave', '1 dash aromatic bitters']  },
      {booze: "Tequila", name: "Oaxacan Old Fashioned ", ingredients: ['1 1/2 oz tequila ', '1/2 oz mezcal', '1/4 oz agave syrup', '2 dashes angostura bitters', 'Garnish: Flamed orange twist']  },
      {booze: "Tequila", name: "Mexican Mule", ingredients: ['2 oz tequila', '1/2 oz lime juice', 'Optional: 1/2 oz simple syrup', '4 oz ginger beer']  },
      {booze: "Tequila", name: "Tequila Negroni ", ingredients: ['1 oz reposado', '1 oz sweet vermouth', '1 oz contrartto apertif (or aperol)', '1 dash orange bitters', 'Garnish: orange twist']  },
      {booze: "Tequila", name: "Espresso Martini", ingredients: ['3/4 oz silver tequila', '3/4 oz patron xo cafe', '3/4 oz espresso shot', 'Fine sugar', 'Garnish: Powdered chocolate ']  },
      {booze: "Tequila", name: "El Diablo", ingredients: ['2 oz tequila ', '3/4 oz lime juice', '1/2 oz crème de cassis', '4 oz ginger beer (To top)', 'Garnish: Lime wedge']  },
      {booze: "Tequila", name: "Silk Stocking", ingredients: ['2 oz tequila ', '1 oz crème de cacao (substitute: kahlua)', '1 oz cream', '1/4 oz grenadine ', 'Garnish: Ground cinnamon ']  },
      {booze: "Tequila", name: "Mezcal Pineapple Sour", ingredients: ['1.5 oz Tequila (Doña Vega Espadin)', '.5 oz fresh pineapple juice', '.75 oz lemon juice', '.75 oz agave', '1 egg white']  },
      {booze: "Tequila", name: "Cherry Blossom", ingredients: ['1.25 oz Tequila (1800 Silver)', '1 oz lime juice', '1 oz grapefruit juice', '.25 oz grenadine', 'Garnish: Grapefruit slice or maraschino cherry ', 'Salt as needed']  },

  
      //Gin
      {booze: "Gin", name: "Gin and Tonic", ingredients: ['2 oz gin', '1/2 oz lime juice', '4-6 oz tonic', 'Garnish: Lime wedge']  },
      {booze: "Gin", name: "Martini", ingredients: ['2 1/4 oz gin', '1/2 oz dry vermouth', 'Optional: 2 dashes orange bitters', 'Dry: less vermouth', 'Wet: more vermouth (2:1 or fifty/fifty)', 'Dirty: 1/2 oz olive brine', 'Garnish: Lemon twist/olive']  },
      {booze: "Gin", name: "Perfect Martinez", ingredients: ['1 oz dry gin (botanist islay)', '1/2 oz cointreau', '1 oz sweet red vermouth ', '1 oz dry vermouth', '1 dash angostura bitters', 'Garnish: Lemon twist']  },
      {booze: "Gin", name: "CBD Dirty Martini ", ingredients: ['2 oz gin', '1/2 oz extra dry vermouth ', '1/2 oz green olive cocktail brine', '1 dash black pepper', 'Garnish: Green olive, CBD oil, cracked pepper']  },
      {booze: "Gin", name: "Vesper", ingredients: ['2 oz gin', '3/4 oz vodka', '1/3 oz lillet blanc']  },
      {booze: "Gin", name: "Aviation", ingredients: ['2 oz gin', '1/2 maraschino liqueur ', '1/4 oz crème de violette', '3/4 oz lemon juice', 'Garnish: Lemon twist']  },
      {booze: "Gin", name: "Negroni", ingredients: ['1 oz gin', '1 oz Campari', '1 oz sweet vermouth ', 'Garnish: Orange twist']  },
      {booze: "Gin", name: "Jasmine", ingredients: ['1 1/2 oz gin', '3/4 oz lemon juice', '1/4 oz Campari ', '1/4 oz cointreau ', 'Garnish: Lemon twist']  },
      {booze: "Gin", name: "Gin Fizz", ingredients: ['2 oz gin', '1 oz lime juice', '3/4 oz simple syrup', '1 egg white', 'Club soda (To top)']  },
      {booze: "Gin", name: "Ramos Gin Fizz", ingredients: ['2 oz gin', '3/4 oz simple syrup', '1/2 oz light cream', '1/2 oz lemon juice', '1 egg white', '3 dashes orange blossom water', 'Soda water (To top)', 'Garnish: Orange twist']  },
      {booze: "Gin", name: "Gin Mule", ingredients: ['2 oz gin', '1/2 oz lime juice', '1/2 oz simple syrup', '4 oz ginger beer', 'Muddle mint in shaker', 'Garnish: Mint']  },
      {booze: "Gin", name: "Tom Collins", ingredients: ['2 oz gin', '1 oz lemon juice', '1 oz simple syrup', 'Soda water (To top)', 'Garnish: Lemon wheel']  },
      {booze: "Gin", name: "Ginger Collins", ingredients: ['1 1/2 oz gin', '3/4 oz Domaine De Canton', '1/2 oz lemon juce', '3 oz club soda (to top)', 'Garnish: Lemon wheel']  },
      {booze: "Gin", name: "Apposta ", ingredients: ['1 1/2 oz gin', '3/4 oz aperol', '3/4 oz sweet vermouth ', '1/4 oz lemon juice', '1 can grapefruit soda', 'Garnish: Fresh Thyme and grapefruit peel']  },
      {booze: "Gin", name: "Gimlet", ingredients: ['2 oz gin (or vodka)', '3/4 oz lime juice', '3/4 oz simple syrup', '(Variations to shake w/: cucumber, fennel, snap peas, mint, basil, dill, thyme)']  },
      {booze: "Gin", name: "French Gimlet", ingredients: ['2 oz gin', '1 1/2 oz St Germain', '1/2 oz lemon juice', 'Garnish: Lime wedge']  },
      {booze: "Gin", name: "Bees Knees", ingredients: ['2 oz gin', '3/4 oz lemon juice', '1/2 oz honey syrup']  },
      {booze: "Gin", name: "Southside", ingredients: ['2 oz gin', '3/4 oz lime juice', '3/4 oz simple syrup', '~5 mint leaves (shake with)', '2-3 drops angostura bitters']  },
      {booze: "Gin", name: "Royal Hawaiian ", ingredients: ['1 1/2 oz gin (Layered on top) (empress)', '1 oz pineapple juice', '1/2 oz lemon juice', '1/2 oz orgeat syrup', 'Garnish: Pineapple slice']  },
      {booze: "Gin", name: "Bronx", ingredients: ['1 3/4 oz gin', '3/4 oz orange juice', '1/4 oz sweet vermouth ', '1/4 oz dry vermouth ']  },
      {booze: "Gin", name: "French 75", ingredients: ['1 1/2 oz gin', '1/2 oz lemon juice', '1/2 oz simple syrup', 'Sparkling wine (To top)', 'Garnish: Lemon twist ']  },
      {booze: "Gin", name: "Pom Thumb", ingredients: ['2 oz gin', '1 oz lime juice', '1 oz simple syrup', '1 oz pomegranate juice poured over top']  },
      {booze: "Gin", name: "Last Word", ingredients: ['3/4 oz gin', '3/4 oz Green Chartreuse ', '3/4 oz maraschino liqueur ', '3/4 oz lime juice']  },
      {booze: "Gin", name: "Gin Sling", ingredients: ['1 1/2 oz gin', '1/2 oz sweet vermouth ', '3/4 oz lemon juice', '3/4 oz simple syrup', '2 dash angostura bitters', 'Garnish: Lemon twist']  },
      {booze: "Gin", name: "Royal Color", ingredients: ['1 1/2 oz gin', '3/4 oz lemon juice', '1 oz pineapple juice', '1/2 oz grenadine ', 'Top with soda', 'Garnish: Fresh mint / colorful edible flower']  },
      {booze: "Gin", name: "Clover Club", ingredients: ['1 1/2 oz gin', '1/2 oz dry vermouth ', '1/2 oz lemon juice', '1/2 oz berry syrup', '1 egg white', 'Garnish: 3 Raspberries ']  },
      {booze: "Gin", name: "Bramble", ingredients: ['2 oz gin', '1 oz lemon juice', '1/2 oz simple syrup', '1/2 oz berry syrup', 'Garnish: Lemon slice, blackberry ']  },
      {booze: "Gin", name: "Hanky Panky", ingredients: ['1 1/2 oz gin', '1 1/2 oz sweet vermouth ', '2 dashes Fernet Branca', 'Garnish: Orange twist']  },
      {booze: "Gin", name: "Corpse Reviver #2", ingredients: ['1/4 oz absinthe (Rinse)', '3/4 oz gin', '3/4 oz Lillet Blanc', '3/4 oz cointreau ', '3/4 oz lemon juice', 'Garnish: Orange twist ']  },
  
      //Rum
      {booze: "Rum", name: "Cuba Libre", ingredients: ['2 oz rum (white)', '1/2 oz lime juice', '4 oz club soda (to top)']  },
      {booze: "Rum", name: "Dark and Stormy", ingredients: ['2 oz dark rum', '1/2 oz lime juice', '4 oz ginger beer', 'Optional: 1/2 oz simple syrup', 'Garnish: Lime wedge ']  },
      {booze: "Rum", name: "El Presidente", ingredients: ['1 1/2 oz run (white)', '3/4 oz dry vermouth ', '3/4 oz cointreau ', '1 bar spoon grenadine ', 'Garnish: cocktail cherry']  },
      {booze: "Rum", name: "Canton Breeze ", ingredients: ['1 oz dark rum', '1 oz Domaine De Canton', '1 oz pineapple juice', 'Garnish: Lime wedge']  },
      {booze: "Rum", name: "Daiquiri ", ingredients: ['2 oz rum (white)', '3/4 oz lime juice', '3/4 simple syrup', '(Variations to shake w/: cucumber, raspberries, blackberries, mint, basil, dill)']  },
      {booze: "Rum", name: "Hemingway Daiquiri ", ingredients: ['2.5 oz rum (white)', '1/2 oz lime juice', '1/4 oz maraschino liqueur ', '1/2 oz grapefruit juice', '1/4 oz simple syrup']  },
      {booze: "Rum", name: "Winter Daiquiri", ingredients: ['1 oz light rum', '1 oz dark rum', '3/4 oz fresh lime', '3/4 oz simple syrup']  },
      {booze: "Rum", name: "Mai Tai", ingredients: ['1 oz light rum', '1 oz dark rum (poured over top)', '3/4 oz orange liqueur ', '3/4 oz lime juice', '1/2 oz simple syrup', '6-8 oz orange pineapple juice']  },
      {booze: "Rum", name: "Mai Tai (Traditional)", ingredients: ['2 oz rum (dark)', '3/4 oz lime juice', '1/2 oz cointreau ', '1/4 oz orgeat', 'Garnish: Mint sprig']  },
      {booze: "Rum", name: "Mojito", ingredients: ['2 oz rum (white)', '3/4 oz lime juice', '1/2 oz simple syrup', '5-8 mint leaves', 'Soda water (to top)', 'Garnish: Lime wheel, mint sprig']  },
      {booze: "Rum", name: "Piña Colada", ingredients: ['2 oz rum (white)', '3 oz pineapple juice', '1 oz cream of coconut ', '1/2 oz lime juice', '*Blend', 'Garnish: Pineapple wedge, cocktail cherry']  },
      {booze: "Rum", name: "Rum Sour", ingredients: ['1 1/2 oz white rum', '1 oz grapefruit juice', '3/4 oz agave syrup ', '1/2 oz Campari', '1/2 oz lime juice']  },
      {booze: "Rum", name: "Airmail", ingredients: ['1 1/4 oz rum (amber/dark)', '1/2 oz lime juice', '1/2 oz honey syrup', '3 oz sparkling wine (to top) (champagne,prosecco,cava)', 'Garnish: Lime wheel']  },
      {booze: "Rum", name: "Painkiller", ingredients: ['2 oz rum (amber/dark)', '1/2 oz lime juice', '1 oz orange juice', '1 oz light coconut milk', '3 oz pineapple juice', 'Garnish: Nutmeg/fruits']  },
      {booze: "Rum", name: "Missionary’s Downfall", ingredients: ['1 1/2 oz rum (white)', '1 oz pineapple juice', '3/4 oz lime juice', '1/2 oz peach liqueur ', '1/2 oz honey syrup ', '10 mint leaves (muddled)', '*Whip shake and pour over ice', 'Garnish: Mint sprig']  },
      {booze: "Rum", name: "Jungle Bird", ingredients: ['1 1/2 oz rum (dark)', '3/4 oz campari', '1 1/2 oz pineapple juice', '1/2 oz lime juice', '1/2 oz simple syrup ', 'Garnish: Pineapple leaves / mint leaves']  },
      {booze: "Rum", name: "Egg Nog", ingredients: ['1 1/4 oz rum', '1 egg', '1 tsp sugar (.15 oz)', '1 oz milk']  },
      {booze: "Rum", name: "Key West Kiss", ingredients: ['2 oz rum', '2 oz pineapple juice', '1/4 oz amaretto ']  },      
  
      //vodka
      {booze: "Vodka", name: "Martini", ingredients: ['2.75 oz vodka', 'Splash of vermouth ']  },
      {booze: "Vodka", name: "Espresso Martini", ingredients: ['2 oz vodka ', '1 oz espresso ', '1/2 oz coffee liqueur (kahlua)', '1/2 oz simple syrup', '1/4 oz vanilla liqueur (optional)', 'Optional: Pinch of salt', 'Garnish: 3 whole coffee beans']  },
      {booze: "Vodka", name: "1 1/2 - 2 oz vodka (Optional: vanilla flavored)", ingredients: ['1 oz espresso ', '3/4 oz coffee liqueur ', 'Optional: 1/2 oz simple syrup ', 'Optional: 1 pinch sea salt', 'Garnish: 3 whole coffee beans']  },
      {booze: "Vodka", name: "Nates:", ingredients: ['1part vodka', '1/3rd vanilla vodka' , '1/3rd Irish liquor' , '1/3rd espresso' , 'dash of simple syrup'] },
      {booze: "Vodka", name: "Earl Grey Infused Martini", ingredients: ['2 oz earl gray infused vodka', '3/4 oz lemon', '1 oz simple syrup (or honey)', '1/2 oz ginger liqueur ']  },
      {booze: "Vodka", name: "Moscow Mule", ingredients: ['2 oz vodka', '1/2 oz lime juice', 'Optional: 1/2 oz simple syrup', '4-6 oz ginger beer', 'Garnish: lime wedge/candied ginger', 'Substitute vodka: gin, dark rum, bourbon, rye, scotch, mezcal']  },
      {booze: "Vodka", name: "Skinny Mule", ingredients: ['1 1/2 oz vodka', '1 oz Domaine De Canton', '1/2 oz lime juice', '3 oz club soda (to top)', 'Garnish: Lime wedge ']  },
      {booze: "Vodka", name: "Cosmopolitan ", ingredients: ['2 oz vodka ', '3/4 - 1 oz orange liqueur', '1/2 oz lime juice ', '1/2 - 1 oz cranberry juice ']  },
      {booze: "Vodka", name: "Lemon Drop", ingredients: ['2 oz vodka', '1 oz cointreau ', '1 oz lemon juice', 'Garnish: Rub lemon wedge on rim and add sugar, lemon wedge']  },
      {booze: "Vodka", name: "Cranberry St. Germain", ingredients: ['2 oz vodka', '1 oz St Germain', '1 oz cranberry juice', '1/2 oz lime juice', 'Garnish: Frozen cranberries and sugar rim']  },
      {booze: "Vodka", name: "Caipirovska", ingredients: ['1/2 lime - muddled', '1/4 oz simple syrup ', '2 oz vodka']  },
      {booze: "Vodka", name: "White Russian", ingredients: ['1 1/2 oz vodka', '1/2 oz kahlua', '1/2 oz cream', '(or 2:1 vodka:kahlua)']  },
      {booze: "Vodka", name: "Sex on the Beach", ingredients: ['1 1/2 oz vodka', '1/2 oz peach schnapps', '1 1/2 oz cranberry juice', '1/2 oz chambord liqueur (optional)']  },
      {booze: "Vodka", name: "Russian Spring Punch", ingredients: ['1 oz vodka', '1/2 oz lemon juice', '1/4 oz creme de cassis', '1/4 oz simple syrup', '3 oz sparkling wine (to top)', 'Garnish: Lemon wheel / blackberries / raspberries ']  },
      {booze: "Vodka", name: "Kamikaze (2 Shots)", ingredients: ['2 oz vodka', '3/4 oz orange liqueur ', '3/4 oz lime juice']  },
      {booze: "Vodka", name: "Bloody Mary", ingredients: ['1 lime wedge', '1 lemon wedge', '2 oz vodka', '4 oz tomatoe juice', '2 dashes tobasco sauce', '2 tsp horseradish ', '2 dashes Worcestershire sauce ', '1 pinch celery salt', '1 pinch ground black pepper', '1 pinch smoked paprika']  },
  

      {booze: "Wine", name: "Negroni Sbagliato", ingredients: ['1 oz Campari', '1 oz sweet vermouth', '2 oz prosecco']  },
      {booze: "Wine", name: "Rose Spritz", ingredients: ['3 oz rose', '2 oz aperol', '1/4 oz grenadine', '2 oz club soda', 'Steps: aperol + grenadine then rose then soda', 'Garnish: Orange wheel']  },
      {booze: "Wine", name: "The Sun Also Rises", ingredients: ['2 oz dry sparkling wine', '1 1/4 oz absinthe', '3/4 oz gin', '3/4 oz lemon juice', '1/4 oz simple syrup', '3 dashes angostura bitters', 'Garnish: Lemon twist']  },
      {booze: "Wine", name: "Ginger Bellini", ingredients: ['1 1/2 oz Domaine De Canton', '2 oz peach puree', '3 oz presecco (to top)']  },
    ];

  const [alcohol, setAlcohol] = React.useState("None"); //liquor dropdown
  const [showChange, setShowChange] = React.useState(false); //inital show button
  const [drinksArray, setDrinksArray]= React.useState([]); //main array of drinks to be shown
  const [noFilterSpecified, setNoFilterSpecified] = React.useState(true); //set to false if any filter is specified
  const [isOpen, setIsOpen] = useState(false); //for popup
  const [filterStr, setFilterStr] = useState("None");

  //filter by Ingredient form
  const onSaveIngredient = (formValue) => {

    //set alcohol filter to none if filtering by ingredient
    setAlcohol("None");
    setNoFilterSpecified(false);
    setFilterStr(formValue.text);


    let tempArray = [];
    let text = formValue.text.toLowerCase();

    for (var i = 0; i < Drinks.length; i++) { //loop thorugh objects

      for (const [key, value] of Object.entries(Drinks[i])) {
        if (key === "ingredients"){
          value.forEach(element => {
            if (element.toLowerCase().includes(text)){

              tempArray.push(Drinks[i].name);

              }
            });
          }
        }
      }
      setDrinksArray(Drinks.filter((value) => tempArray.includes(value.name))
      .map((val,index) => (
        <Cocktail key={index} cocktail ={val}/>
      )));


  };

  //filter by name form
  const onSaveName = (values) => {

    //set alcohol to none if filtering by name
    setAlcohol("None");
    setNoFilterSpecified(false);
    setFilterStr(values.text);

    setDrinksArray(Drinks.filter((value) => value.name.toLowerCase().includes(values.text.toLowerCase()))
    .map((val,index) => (
      <Cocktail key={index} cocktail ={val}/>
    )));

  };

  const options = [
    { label: 'None', value: 'None' },
    { label: 'Tequila', value: 'Tequila' },
    { label: 'Whiskey/Rye/Bourbon', value: "Whiskey/Rye/Bourbon"},
    { label: 'Rum', value: 'Rum' },
    { label: 'Gin', value: 'Gin' },
    { label: 'Vodka', value: 'Vodka' },
    { label: 'Wine', value: 'Wine' },
  ];

  //for dropdown
  const handleAlcoholChange = (event) => {

    setAlcohol(event.target.value);
    setFilterStr(event.target.value);

    if (event.target.value === "None") { //dont filter
      setDrinksArray(Drinks
      .map((val,index) => (
        <Cocktail key={index} cocktail ={val}/>
      )));
    } else {//filter by alcohol
      setDrinksArray(Drinks.filter((value) => value.booze === event.target.value)
      .map((val,index) => (
        <Cocktail key={index} cocktail ={val}/>
      )));
    }
  };

  //initial on show button
  const onShow = () => {
    if (alcohol === "None" && noFilterSpecified) { //on initial start, if nothing selected show everything
      setDrinksArray(Drinks
      .map((val,index) => (
        <Cocktail key={index} cocktail ={val}/>
      )));
    }

    setShowChange(true);
  }
  
  //for pop up
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
 
  const infoText = "This application was created as a gift for my family. As of June 23rd 2022, the catalog currently contains 125 cocktails.\n That being said, we're big fans of trying new ones. If you use this application and wish to see more drinks added to it please email connor.catalog@gmail.com a cocktail in this example format: \n Gin and Tonic \n 2 oz gin \n 1/2 oz lime juice \n 4-6 oz tonic \n Garnish: Lime wedge "; 


  return (
    <section className = "container">

      <div className ="left-half">
      <div>
        {/* <FaInfo onClick={togglePopup} className="icon-right"></FaInfo> */}
        {/* <FaInfoCircle onClick={togglePopup} className="icon-right"></FaInfoCircle> */}

        {isOpen && <Popup
          content={<> 
          <body>Hi!</body>
          <div className="display-linebreak"> 
            {infoText} 
          </div>

          </>} 
          handleClose={togglePopup}
        />}
      </div>
      <div className="divCenter">
      <Header/>
      <Dropdown
          label="Filter by Liquor "
          options={options}
          value={alcohol}
          onChange={handleAlcoholChange}
        />
        <p> </p> 
      <Form
          onSave = {onSaveIngredient} nameForm = 'Filter by Ingredient '
      />
      <Form
          onSave = {onSaveName} nameForm = 'Filter by Name '
      />


      {!showChange ?  <Button
          color = 'black' text = 'Start' onClick={onShow}
      /> : ''}
      
      {showChange && filterStr!=="None"? <p>Showing results based on: {filterStr}</p>: ''}
      {showChange ? <Matrix cells={drinksArray} /> : <p>Click Start</p>}

      </div>

      </div>

    </section>


  );
}