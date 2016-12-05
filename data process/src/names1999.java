import org.json.JSONException;
import org.json.JSONObject;
import sun.jvm.hotspot.utilities.soql.JSJavaArray;

import java.io.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;

/**
 * Created by bowang on 11/30/16.
 */
public class names1999 {
    public static void main (String[] args) throws IOException, JSONException {
        HashMap<String, Integer> from = new HashMap<>();
        HashMap<String, Integer> to = new HashMap<>();

        File file = new File("#1999");
        Scanner scanner = new Scanner(new FileInputStream(file));
        while (scanner.hasNextLine()) {
            JSONObject object = new JSONObject(scanner.nextLine());
            String add1 = object.getString("from").toString().replaceAll("\"|\'", "").replaceAll("\\s+", "");
            if (add1.contains("@enron.com")) {
                if (from.containsKey(add1)) {
                    from.put(add1, from.get(add1) + 1);
                } else {
                    from.put(add1, 1);
                }
            }
            String[] ss = object.get("to").toString().split(",");
            for (String s : ss) {
                String add2 = s.replaceAll("\"|\'", "").replaceAll("\\s+", "");
                if (add2.contains("@enron.com")) {
                    if (to.containsKey(add2)) {
                        to.put(add2, to.get(add2) + 1);
                    } else {
                        to.put(add2, 1);
                    }
                }
            }
        }
        int count = 0;
        System.out.println("# from");
        for (String s : from.keySet()) {
            System.out.println(++count + "  " + s + "  " + from.get(s));
        }
//        count = 0;
//        System.out.println("# to");
//        for (String s : to.keySet()) {
//            System.out.println(++count + "  " + s +"  " + to.get(s));
//        }

        if(from.containsKey("j")) {
            System.out.println("fuck");
        }
        count = 0;

        System.out.println("# commom");
        for (String s : from.keySet()) {
            if (to.containsKey(s)) {
                File ffff = new File("ffff.txt");
                FileWriter writer = new FileWriter(ffff, true);
                writer.write(++count + "  " + s + "  " + from.get(s) + "  " + to.get(s) + "\n");
                writer.close();
            }
        }

    }
}
