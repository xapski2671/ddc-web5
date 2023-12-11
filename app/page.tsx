"use client"
import { useState } from "react"
import { Web5 } from "@web5/api"
// import { webcrypto } from "node:crypto"
import s from "./home.module.sass"
import { cutStr } from "@/utils/cutStr"
import { tier } from "@/types"
import axios from "axios"

// @ts-ignore
// if (!globalThis.crypto) globalThis.crypto  n= webcrypto

export default function Home() {
	const [pCover, setPCover] = useState<any>()
	const [pImg, setPImg] = useState("")
	const [arts, setArts] = useState<any>()
	const [UserDID, setUserDID] = useState("")
	const [PName, setPName] = useState("")
	const [PTagL, setPTagL] = useState("")
	const [AQty, setAQty] = useState("")
	const [tierAdder, setTierAdder] = useState(false)
	const [tiers, setTiers] = useState<tier[]>([])
	const [currTierName, setCurrTierName] = useState("")
	const [currAViewer, setCurrAViewer] = useState("")
	const [CAViewers, setCAViewers] = useState<string[]>([])

	async function toBase64(file: any) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = reject
		})
	}

	async function handleImgChange(e: any) {
		// console.log(e.target.files)
		const iimg = await toBase64(e.target.files[0])
		setPCover(URL.createObjectURL(e.target.files[0]))
		typeof iimg == "string" && setPImg(iimg)
	}

	function modArr() {
		const uniqueArr: string[] = [...new Set(CAViewers)]
		return uniqueArr
	}

	async function addTier() {
		const artsToGo: string[] = []

		// function dataUrlToFile(dataUrl: any, filename: string): File | undefined {
		// 	const arr = dataUrl.split(",")
		// 	if (arr.length < 2) {
		// 		return undefined
		// 	}
		// 	const mimeArr = arr[0].match(/:(.*?);/)
		// 	if (!mimeArr || mimeArr.length < 2) {
		// 		return undefined
		// 	}
		// 	const mime = mimeArr[1]
		// 	const buff = Buffer.from(arr[1], "base64")
		// 	return new File([buff], filename, { type: mime })
		// }

		for (let art of arts) {
			let aobj = await toBase64(art)
			typeof aobj == "string" && artsToGo.push(aobj)
		}

		const tier: tier = {
			name: currTierName,
			aViewers: CAViewers,
			artWorks: artsToGo,
			projectName: PName,
			projectImage: pImg,
			projectCreatorDID: UserDID,
		}

		setTiers((prev) => [...prev, tier])
	}

	async function handleSubmit() {
		const grandProject = {
			userDID: UserDID,
			projectName: PName,
			projectImage: pImg,
			projectTagL: PTagL,
			artQuantity: AQty,
			tiers: tiers,
		}

		console.log(grandProject)
		const res = await axios.post(
			"http://localhost:5001/data",
			JSON.stringify(grandProject),
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		// const res = await axios.post(
		// 	"http://localhost:5001/data",
		// 	tiers[0].artWorks
		// )
		console.log(tiers[0].artWorks)
		console.log(res)
	}

	return (
		<div className={s.home}>
			<form
				className={s.form}
				onSubmit={(e) => {
					e.preventDefault()
					handleSubmit()
				}}
			>
				<div className={s.heading}>
					<h3>Project Information</h3>
					<div className={s.sep} />
				</div>

				<div className={s.input_grp}>
					<label htmlFor="u_did">User DID</label>
					<input
						name={"u_did"}
						type="text"
						className={s.input}
						placeholder={"example: did:ion:EIA-249..."}
						onChange={(e) => {
							setUserDID(e.target.value)
						}}
						value={UserDID}
					/>
				</div>

				<div className={s.input_grp}>
					<label htmlFor="p_name">Project Name</label>
					<input
						name={"p_name"}
						type="text"
						className={s.input}
						placeholder={"example: Mohr's Collection"}
						onChange={(e) => {
							setPName(e.target.value)
						}}
						value={PName}
					/>
				</div>

				<div className={s.input_grp}>
					<label htmlFor="p_tagl">Project Tagline</label>
					<input
						name={"p_tagl"}
						type="text"
						className={s.input}
						placeholder={"example: A collection of my latest work"}
						onChange={(e) => {
							setPTagL(e.target.value)
						}}
						value={PTagL}
					/>
				</div>

				<div className={s.input_grp}>
					<label htmlFor="a_qty">Art Quantity</label>
					<input
						name={"a_qty"}
						type="number"
						className={s.input_no}
						onChange={(e) => {
							setAQty(e.target.value)
						}}
						value={AQty}
					/>
				</div>

				<div className={s.img_inpt_grp} id="pi_upld">
					<p>Project Cover Image</p>

					<div className={s.img_upl_wrp}>
						<input
							type="file"
							id="pc-img"
							hidden
							onChange={(e) => {
								handleImgChange(e)
							}}
							required
						/>
						<label htmlFor="pc-img" className={s.pc_img_lbl}>
							<div className={s.pc_img_wrp}>
								{pCover ? (
									<img src={pCover} alt="--" className={s.pc_img} />
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className={s.upl_icon}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
										/>
									</svg>
								)}
							</div>
						</label>
					</div>
				</div>

				<div className={s.tiers}>
					{tiers.map((tier, idx) => {
						return (
							<div className={s.tier_wrp} key={idx}>
								<div className={s.tier}>
									<h4 className={s.tier_name}>{tier.name}</h4>
									<p>{`Images: ${tier.artWorks.length} files selected`}</p>
									<p>Authorized Viewers</p>
									<ul className={s.a_viewers}>
										{tier.aViewers.map((aviewer, iidx) => {
											return <li key={iidx}>{cutStr(aviewer, 9)}</li>
										})}
									</ul>
								</div>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className={s.x_for_list}
									onClick={() => {
										tiers.splice(idx, 1)
										setTiers((prev) => [...tiers])
									}}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						)
					})}
				</div>

				{tierAdder && (
					<div className={s.tier_form}>
						<div className={s.input_grp}>
							<label htmlFor="ti_name">Tier Name</label>
							<input
								name={"ti_name"}
								type="text"
								className={s.input}
								placeholder={"example: Tier 1"}
								onChange={(e) => {
									setCurrTierName(e.target.value)
								}}
								value={currTierName}
							/>
						</div>

						<div className={s.input_grp}>
							<label htmlFor="tier_img">Images</label>
							<input
								name={"tier_img"}
								type="file"
								multiple
								accept={"image/png, image/jpg, image/svg, image/jpeg"}
								className={s.input}
								onChange={(e) => {
									setArts(e.target.files)
								}}
								// placeholder={"example: Tier 1"}
							/>
						</div>

						<div className={s.input_grp}>
							<label htmlFor="a_viewers">Authorized Viewers</label>
							<div className={s.input_for_list}>
								<input
									name={"a_viewers"}
									type="text"
									className={s.input}
									placeholder={"example: did:ion:EA33-Ip..."}
									onChange={(e) => {
										setCurrAViewer(e.target.value)
									}}
									value={currAViewer}
								/>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className={s.add_icon}
									onClick={() => {
										setCAViewers((prev) => [...prev, currAViewer])
										setCurrAViewer("")
									}}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>

							<ul className={s.viewer_list}>
								{modArr().map((viewer, idx) => {
									return (
										<div className={s.viewer_grp} key={idx}>
											<li className={s.viewer}>{cutStr(viewer, 8)}</li>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												className={s.x_for_list}
												onClick={() => {
													CAViewers.splice(idx, 1)
													setCAViewers((prev) => [...CAViewers])
												}}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
									)
								})}
							</ul>
						</div>

						<div className={s.add_tier_btn}>
							<div
								onClick={() => {
									addTier()
									setCurrTierName("")
									setArts([])
									setCAViewers([])
									setTierAdder(false)
								}}
							>
								Add tier
							</div>
						</div>
					</div>
				)}

				<div className={s.tier_adder}>
					<p>Add a tier</p>
					<div
						className={s.tier_adder_btn}
						onClick={() => {
							setTierAdder(true)
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className={s.add_icon}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</div>

				<button className={s.submit_btn} type={"submit"}>
					Submit Project
				</button>
			</form>
		</div>
	)
}
