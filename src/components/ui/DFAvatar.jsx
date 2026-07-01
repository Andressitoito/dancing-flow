const DFAvatar = ({
  name,
  size = 48,
}) => {

  return (

    <div

      style={{
        width: size,
        height: size,
      }}

      className="
        rounded-xl
        bg-primary/10
        border
        border-primary/20
        flex
        items-center
        justify-center
        font-bold
        text-primary
      "

    >

      {name?.charAt(0)?.toUpperCase()}

    </div>

  );

};

export default DFAvatar;