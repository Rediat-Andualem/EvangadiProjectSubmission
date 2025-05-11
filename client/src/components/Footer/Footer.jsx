import React from "react";
import logo from "../../assets/evangadi-logo-footer (1).png";
import './Footer.css'
import { BiLogoFacebook } from "react-icons/bi";
import { AiFillInstagram } from "react-icons/ai";
import { AiFillYoutube } from "react-icons/ai";
function Footer() {
	return (
		<div className="footerMain">
			<div className="container px-sm-4">
				<div className="row">
					<div className="col-12 col-md-4 ">
						<div className="logo">
							<img src={logo} alt="" />
						</div>
						<div className="d-flex ">
							<div className="social">
								<a href="">
									<BiLogoFacebook />
								</a>
							</div>
							<div className="social">
								<a href="">
									<AiFillInstagram />
								</a>
							</div>
							<div className="social">
								<a href="">
									<AiFillYoutube />
								</a>
							</div>
						</div>
					</div>
					<div className="col-12 col-md-4 footer-links">
						<h5>Useful Link</h5>
						<ul className="row">
							<li>
								<a href="">How it works</a>
							</li>
							<li>
								<a href="">Terms of Service</a>
							</li>
							<li>
								<a href="">Privacy policy</a>
							</li>
						</ul>
					</div>
					<div className="col-12 col-md-4 footer-links">
						<h5>Contact Info</h5>
						<ul className="row">
							<li>Evangadi Networks</li>
							<li>support@evangadi.com</li>
							<li>+1-202-386-2702</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}


export default Footer;