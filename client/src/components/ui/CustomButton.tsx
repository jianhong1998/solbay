import React, { MouseEventHandler } from 'react';

interface ICustomButton {
  title: string;
  containerStyles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

const CustomButton: React.FC<ICustomButton> = (props) => {
  const { title, containerStyles, handleClick } = props;

  return (
    <button
      disabled={false}
      type={'button'}
      className={`custom-btn ${containerStyles}`}
      onClick={handleClick}
    >
      <span className="flex-1">{title}</span>
    </button>
  );
};

export default CustomButton;
