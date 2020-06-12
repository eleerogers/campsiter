import {useState, useRef, useEffect} from "react";

function useHover() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const handleMouseEnter = () => {setHovered(true)};
  const handleMouseLeave = () => {setHovered(false)};

  useEffect(() => {
    const node = ref.current;

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return (() => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    })
  }, []);

  return [hovered, ref]
}

export default useHover;
