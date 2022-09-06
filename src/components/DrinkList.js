
const DrinkList = (props) => { //{ tasks, onDelete, onToggle }
    const list = props.list;
    const listItems = list.map((list)=>
    <li>{list}</li>  
  );  


  return (
    <div>
    <ul>{listItems}</ul> 
    </div>

  )
}

export default DrinkList;