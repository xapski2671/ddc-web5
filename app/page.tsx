"use client"
import { useState } from "react"
import s from "./sign_in.module.sass"
import axios from "axios"

export default function SignIn() {
	const [UserName, setUserName] = useState("")
	const [UserDID, setUserDID] = useState("")
	const [LSUserDID, setLSUserDID] = useState("")
	const [signable, setSignable] = useState(true)
	const [signed, setSigned] = useState(false)
	const [didCopied, setDidCopied] = useState(false)
	const [signUpState, setSignUpState] = useState(true)

	async function handleSignIn() {
		const query = {
			username: UserName,
			did: UserDID,
		}

		const res = await axios.post(
			"http://51.20.130.26:5001/web5/signable",
			JSON.stringify(query),
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		console.log(res)

		if (res.data.success) {
			setSignable(true)
			const ressu = await axios.post(
				"http://51.20.130.26:5001/web5/sign-user",
				JSON.stringify(query),
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			console.log(ressu)
			ressu.data.status == 200 ? setSigned(true) : setSigned(false)
			ressu.data.status == 200
				? setUserDID(ressu.data.message.did)
				: setUserDID("")
		} else {
			setSignable(false)
		}
	}

	async function handleLogin() {
		const query = {
			username: UserName,
			did: LSUserDID,
		}

		const ressu = await axios.post(
			"http://localhost:5001/web5/login",
			JSON.stringify(query),
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		console.log(ressu)
	}

	async function copyDID() {
		if (UserDID) {
			try {
				await navigator.clipboard.writeText(UserDID)
				setDidCopied(true)
				console.log("DID copied to clipboard")

				setTimeout(() => {
					setDidCopied(false)
				}, 3000)
			} catch (err) {
				console.log("Failed to copy DID: " + err)
			}
		}
	}

	return (
		<div className={s.home}>
			<h1 className={s.i_heading}>Digital Dream Creators</h1>
			<form
				className={s.form}
				onSubmit={(e) => {
					e.preventDefault()
					{
						signUpState ? handleSignIn() : handleLogin()
					}
				}}
			>
				<div className={s.heading}>
					<div className={s.try_option}>
						<h3
							onClick={() => {
								setSignUpState((prev) => !prev)
							}}
						>
							{signUpState ? "Sign Up" : "Log in"}
						</h3>
						<span
							onClick={() => {
								setSignUpState((prev) => !prev)
							}}
						>
							{signUpState ? "Log in" : "Sign Up"}
						</span>
					</div>
					<div className={s.sep} />
				</div>

				<div className={s.input_grp}>
					<label htmlFor="u_did">Username</label>
					<input
						name={"u_did"}
						type="text"
						className={s.input}
						placeholder={"example: ramone54"}
						onChange={(e) => {
							setUserName(e.target.value)
						}}
						value={UserName}
					/>
				</div>

				<div className={s.input_grp}>
					<label htmlFor="u_did">DID</label>
					{signUpState ? (
						<div className={s.input_did}>
							<div className={s.did_wrp}>
								{UserDID ? UserDID : "Your DID will be revealed here..."}
							</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className={s.clip_icon}
								onClick={() => {
									copyDID()
								}}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
								/>
							</svg>
						</div>
					) : (
						<input
							name={"u_did"}
							type="text"
							className={s.input}
							placeholder={"example: did:ion:EIA-249..."}
							onChange={(e) => {
								setLSUserDID(e.target.value)
							}}
							value={LSUserDID}
						/>
					)}
				</div>

				{signUpState ? (
					!UserDID ? (
						<button type={"submit"} className={s.sign_in_btn}>
							Sign up
						</button>
					) : (
						<a href="/submit">
							<button type={"button"} className={s.sign_in_btn}>
								Submit a Project
							</button>
						</a>
					)
				) : (
					<button type={"submit"} className={s.sign_in_btn}>
						Login
					</button>
				)}
			</form>
		</div>
	)
}
