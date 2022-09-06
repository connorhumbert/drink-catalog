

const Cocktail = ({cocktail}) => {

    const list = cocktail.ingredients;
    
    return (
      <div className='task'>
          <h3>
            {cocktail.name} 
          </h3>
          {list.map((list,index)=>
            <li key = {index}>{list}</li>  
          )}

      </div>
    )
  }
  
  export default Cocktail