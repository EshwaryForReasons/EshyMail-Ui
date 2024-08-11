"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "C/components/ui/button"
import { Input } from "C/components/ui/input"
import { Label } from "C/components/ui/label"
import { Carousel, CarouselContent, CarouselItem } from "C/components/ui/carousel";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { FaYahoo } from "react-icons/fa";

export default function Dashboard() {
	const [carouselApi, setCarouselApi] = useState(null);
	const { push } = useRouter();

	const onAccountsListUpdated = () => {
		console.log("list updated", "http://localhost:" + window.cefGetPort())
		push('/');
	}

	const onAddAccount = () => {
		const firstName = window.document.getElementById("first-name").value;
		const email = window.document.getElementById("email").value;
		const imapsUrl = window.document.getElementById("imaps-url").value;
		const smtpsUrl = window.document.getElementById("smtps-url").value;
		const password = window.document.getElementById("password").value;
		window.cefAddAccount(firstName, email, imapsUrl, smtpsUrl, password, onAccountsListUpdated);
	};

	const onAddGoogleAccount = () =>
		window.cefAddGoogleAccount(onAccountsListUpdated);
	const onAddMicrosoftAccount = () =>
		window.cefAddMicrosoftAccount(onAccountsListUpdated);
	const onAddYahooAccount = () =>
		window.cefAddYahooAccount(onAccountsListUpdated);

	return (
		<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
			<div className="hidden bg-muted lg:block">
				<img src="https://i.pinimg.com/originals/54/0d/eb/540deb4957e18f02545e5fc337fbcec9.jpg" className="h-lvh w-lvw object-cover" />
			</div>
			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid w-[350px] gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-3xl font-bold">EshyMail</h1>
					</div>
					<div className="sm:max-w-[425px]">
						<Carousel className="h-[500px]" setApi={setCarouselApi}>
							<CarouselContent>
								<CarouselItem key={0}>
									<div className="grid gap-4 h-full flex content-center">
										<Button className="w-full button flex justify-center" variant="outline" onClick={onAddGoogleAccount}>
											<FcGoogle /><p>Add Google Account</p>
										</Button>
										<Button className="w-full button flex justify-center" variant="outline" onClick={onAddMicrosoftAccount}>
											<FaMicrosoft /><p>Add Microsoft Account</p>
										</Button>
										<Button className="w-full button flex justify-center" variant="outline" onClick={onAddYahooAccount}>
											<FaYahoo /><p>Add Yahoo Account</p>
										</Button>
										<Button className="w-full button" variant="outline" onClick={() => carouselApi.scrollTo(1)}>Add Account Manually</Button>
									</div>
								</CarouselItem>
								<CarouselItem key={1}>
									<div className="grid gap-5">
										<div className="grid gap-2">
											<Label htmlFor="first-name">Account Name</Label>
											<Input id="first-name" placeholder="John Smith" required />
										</div>
										<div className="grid gap-2">
											<Label htmlFor="email">Email</Label>
											<Input id="email" type="email" placeholder="email@example.com" required />
										</div>
										<div className="grid gap-2">
											<Label htmlFor="email">IMAPS URL</Label>
											<Input id="imaps-url" type="url" placeholder="imaps://imap.provider.com" required />
										</div>
										<div className="grid gap-2">
											<Label htmlFor="email">SMTPS URL</Label>
											<Input id="smtps-url" type="url" placeholder="smtps://smtps.provider.com" required />
										</div>
										<div className="grid gap-2">
											<Label htmlFor="password">Password</Label>
											<Input id="password" type="password" />
										</div>
										<Button type="submit" className="w-full button" onClick={onAddAccount}>Add Account</Button>
										<Button className="w-full button" variant="outline" onClick={() => carouselApi.scrollTo(0)}>Go Back</Button>
									</div>
								</CarouselItem>
							</CarouselContent>
						</Carousel>
					</div>
				</div>
			</div>
		</div>
	)
}
