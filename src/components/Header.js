import PropTypes from 'prop-types'
// import {FaCocktail} from "react-icons/fa";

const Header = () => {

  const text = "Drink Catalog";
  return (
    <header className='header'>
      {/* <FaCocktail/> */}
      <h1>{text}</h1>
      {/* <FaCocktail/> */}
    </header>
  )
}

Header.defaultProps = {
  title: 'Drink Catalog',
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}

// CSS in JS
// const headingStyle = {
//   color: 'red',
//   backgroundColor: 'black',
// }

export default Header