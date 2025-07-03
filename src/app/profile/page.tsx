
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-headline">Church Profile</h1>
        <p className="text-muted-foreground">About Every Nation Indonesia</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                    To honor God by establishing Christ-centered, Spirit-empowered, socially responsible churches and campus ministries in every nation. We are committed to raising up leaders who will transform society through the power of the Gospel.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                    We see a future where every person in Indonesia has the opportunity to hear the Gospel, and where vibrant communities of faith are transforming every sphere of society. We envision a generation of leaders equipped to make a difference in their families, workplaces, and nation.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4 text-muted-foreground list-disc list-inside">
                        <li>
                            <span className="font-semibold text-foreground">Lordship:</span> We value whole-hearted submission to the leadership of Jesus Christ.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">Evangelism:</span> We are passionate about sharing the Gospel with everyone.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">Discipleship:</span> We are committed to helping people grow in their faith.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">Leadership:</span> We believe in raising and empowering leaders for every generation.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">Family:</span> We cherish loving, healthy relationships in our church community.
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card className="overflow-hidden">
                <Image
                    src="https://placehold.co/600x400.png"
                    alt="Church community"
                    data-ai-hint="church community"
                    width={600}
                    height={400}
                    className="object-cover w-full h-auto"
                />
                <CardHeader>
                    <CardTitle className="text-lg">Join Our Community</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        We are a diverse family of believers united by our love for Jesus and our passion for His purposes.
                    </p>
                </CardContent>
            </Card>
             <Card className="overflow-hidden">
                <Image
                    src="https://placehold.co/600x400.png"
                    alt="Worship service"
                    data-ai-hint="worship service"
                    width={600}
                    height={400}
                    className="object-cover w-full h-auto"
                />
                 <CardHeader>
                    <CardTitle className="text-lg">Sunday Services</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Experience powerful worship and life-changing messages every week.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
