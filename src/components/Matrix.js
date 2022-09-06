

const Matrix = ({cells}) => {

    var arrays = [], size = 3;
    
    for (let i = 0; i < cells.length; i += size)
       arrays.push(cells.slice(i, i + size));

    return (
      <div className="wrapper">
        {
          arrays.map((arrays,i) => (
            <div key={i} className="row">
              {
                arrays.map((cell,j) => (
                  <div key={j}  >
                    {cell}
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    )
  }

export default Matrix