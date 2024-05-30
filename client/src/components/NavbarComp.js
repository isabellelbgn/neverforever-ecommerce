import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default class NavbarComp extends Component {
  render() {
    return (
      <nav class="navbar navbar-expand-lg  bg-black">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="navbar-items">
                <a class="nav-link text-white ms-5" href="#">
                  HOME
                </a>
              </li>
              <li class="navbar-items">
                <a class="nav-link text-white ms-5" href="#">
                  SHOP
                </a>
              </li>
            </ul>

            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ms-auto">
                <li class="navbar-items">
                  <a class="nav-link text-white me-5" href="#">
                    SEARCH
                  </a>
                </li>
                <li class="navbar-items">
                  <a class="nav-link text-white me-5" href="#">
                    ACCOUNT
                  </a>
                </li>
                <li class="navbar-items">
                  <a class="nav-link text-white me-5" href="#">
                    CART
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
