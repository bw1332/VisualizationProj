

import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

/**
 * Created by bowang on 12/3/16.
 */
public class split {
    public static void main(String[] args) throws IOException, JSONException, ParseException {
        File file = new File("#50#1999");
        Scanner scanner = new Scanner(new FileInputStream(file));
        while (scanner.hasNextLine()) {
            JSONObject object = new JSONObject(scanner.nextLine());
            SimpleDateFormat format = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z (z)");
            Date date = format.parse(object.get("date").toString());
            String month = new SimpleDateFormat("MMM").format(date).toString();
            String day = new SimpleDateFormat("dd").format(date).toString();
            String time = new SimpleDateFormat("HH:mm:ss").format(date).toString();
            JSONObject one = new JSONObject();
            one.put("month", month);
            one.put("day", day);
            one.put("time", time);
            one.put("from", object.get("from").toString());
            one.put("xfrom", object.get("x-from").toString());
            one.put("to", object.get("to"));
            one.put("xto", object.get("x-to"));
            File mfile = new File(month);
            FileWriter writer = new FileWriter(mfile, true);
            writer.append(one.toString() + ",\n");
            writer.close();
        }
    }

}
