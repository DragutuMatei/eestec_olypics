import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectComp({ to }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, []);
  return <>asd</>;
}

export default RedirectComp;
