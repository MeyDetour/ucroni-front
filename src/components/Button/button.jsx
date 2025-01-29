import './button.css';
import { useNavigate } from 'react-router-dom';

const Button = (props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(props.action);
    };

    return (
        <div className="buttonContainer">
            <button onClick={handleClick} className="button" type="button">
                {props.text}
            </button>
        </div>
    );
};

export default Button;
