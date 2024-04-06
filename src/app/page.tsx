"use client";

import React, {useEffect, useState} from "react";
var inpData = 0
export default function Home() {
    useEffect(() => {
      fetch("http://localhost:8080")
      .then((response) => response.json())
      .then((data) => {
          inpData = data.message
      })
  })

  return (
    inpData
  );
}
