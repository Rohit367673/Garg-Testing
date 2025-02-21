import React from "react";

function Address() {
  return (
    <>
      <div className="A-body">
        <div className="A-container">
          <div className="A-image-container">
            <div className="A-image-content">
              <img src="delivery-icon.png" alt="" class="" />
            </div>
          </div>
          <div className="A-form-container">
            <h2>DELIVERY INFO</h2>
            <form>
              <div className="A-form-group">
                <input type="text" name="first-name" placeholder="First name" />
                <input type="text" name="last-name" placeholder="Last name" />
              </div>
              <div className="A-form-group">
                <input type="text" name="address" placeholder="Address" />
              </div>
              <div className="A-form-group">
                <select name="state">
                  <option value="">State</option>
                  <option value="">Himachal Pradesh</option>
                </select>
                <select name="city">
                  <option value="">City</option>
                  <option value="">Kangra</option>
                  <option value="">Dharamshala</option>
                  <option value="">Shimla</option>
                </select>
              </div>
              <div className="A-form-group">
                <input type="text" name="number" placeholder="Contact Number" />
              </div>
              <button type="submit" className="A-btn">
                PLACE ORDER
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Address;
